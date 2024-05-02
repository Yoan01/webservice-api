const express = require('express');
const router = express.Router();
const Conversation = require('../models/conversation');

/**
 * @swagger
 * tags:
 *   name: Conversations
 *   description: API for managing conversations
 */

/**
 * @swagger
 * /api/conversations:
 *   post:
 *     summary: Create a new conversation
 *     description: Create a new conversation with the provided information
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               participants:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Conversation created successfully
 *       400:
 *         description: Error creating conversation
 */
router.post('/conversations', async (req, res) => {
    try {
        const conversation = new Conversation(req.body);
        await conversation.save();
        res.status(201).json(conversation);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

/**
 * @swagger
 * /api/conversations:
 *   get:
 *     summary: Get all conversations
 *     description: Retrieve all conversations stored in the database
 *     responses:
 *       200:
 *         description: Conversations retrieved successfully
 *       500:
 *         description: Error retrieving conversations
 */
router.get('/conversations', async (req, res) => {
    try {
        const conversations = await Conversation.find();
        res.json(conversations);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/**
 * @swagger
 * /api/conversations/{id}:
 *   get:
 *     summary: Get a conversation by its ID
 *     description: Retrieve a specific conversation based on the provided ID
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the conversation to retrieve
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Conversation retrieved successfully
 *       404:
 *         description: Conversation not found
 *       500:
 *         description: Error retrieving conversation
 */
router.get('/conversations/:id', getConversation, (req, res) => {
    res.json(res.conversation);
});

// Middleware to get a conversation by ID
async function getConversation(req, res, next) {
    let conversation;
    try {
        conversation = await Conversation.findById(req.params.id);
        if (conversation == null) {
            return res.status(404).json({ message: 'Conversation not found' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.conversation = conversation;
    next();
}

module.exports = router;
