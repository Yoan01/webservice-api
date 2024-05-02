const express = require('express');
const router = express.Router();
const Message = require('../models/message');
const User = require('../models/user');

/**
 * @swagger
 * tags:
 *   name: Messages
 *   description: API for managing messages
 */

/**
 * @swagger
 * /api/messages:
 *   post:
 *     summary: Create a new message
 *     description: Create a new message with the provided information
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sender:
 *                 type: string
 *               recipient:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Message created successfully
 *       400:
 *         description: Error creating message
 */
router.post('/messages', async (req, res) => {
    try {
        const message = new Message(req.body);
        await message.save();

        // Récupérez l'utilisateur destinataire du message
        const recipientUser = await User.findById(message.recipient);

        if (recipientUser) {
            // Créer une nouvelle notification pour l'utilisateur destinataire
            const notification = new Notification({
                recipient: recipientUser._id,
                content: `You have received a new message from ${message.sender}.`
            });

            // Sauvegarder la notification dans la base de données
            await notification.save();

            // Émettre un événement WebSocket pour notifier l'utilisateur destinataire
            io.to(recipientUser.socketId).emit('newMessage', { message: 'You have received a new message.' });
        }

        res.status(201).json(message);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


/**
 * @swagger
 * /api/messages:
 *   get:
 *     summary: Get all messages
 *     description: Retrieve all messages stored in the database
 *     responses:
 *       200:
 *         description: Messages retrieved successfully
 *       500:
 *         description: Error retrieving messages
 */
router.get('/messages', async (req, res) => {
    try {
        const messages = await Message.find();
        res.json(messages);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/**
 * @swagger
 * /api/messages/{id}:
 *   get:
 *     summary: Get a message by its ID
 *     description: Retrieve a specific message based on the provided ID
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the message to retrieve
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Message retrieved successfully
 *       404:
 *         description: Message not found
 *       500:
 *         description: Error retrieving message
 */
router.get('/messages/:id', getMessage, (req, res) => {
    res.json(res.message);
});

// Middleware to get a message by ID
async function getMessage(req, res, next) {
    let message;
    try {
        message = await Message.findById(req.params.id);
        if (message == null) {
            return res.status(404).json({ message: 'Message not found' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.message = message;
    next();
}

module.exports = router;
