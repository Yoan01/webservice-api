const express = require('express');
const router = express.Router();
const Notification = require('../models/notification');

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: API for managing notifications
 */

/**
 * @swagger
 * /api/notifications:
 *   post:
 *     summary: Create a new notification
 *     description: Create a new notification with the provided information
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               recipient:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Notification created successfully
 *       400:
 *         description: Error creating notification
 */
router.post('/notifications', async (req, res) => {
    try {
        const notification = new Notification(req.body);
        await notification.save();
        res.status(201).json(notification);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Get all notifications
 *     description: Retrieve all notifications stored in the database
 *     responses:
 *       200:
 *         description: Notifications retrieved successfully
 *       500:
 *         description: Error retrieving notifications
 */
router.get('/notifications', async (req, res) => {
    try {
        const notifications = await Notification.find();
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/**
 * @swagger
 * /api/notifications/{id}:
 *   get:
 *     summary: Get a notification by its ID
 *     description: Retrieve a specific notification based on the provided ID
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the notification to retrieve
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notification retrieved successfully
 *       404:
 *         description: Notification not found
 *       500:
 *         description: Error retrieving notification
 */
router.get('/notifications/:id', getNotification, (req, res) => {
    res.json(res.notification);
});

// Middleware to get a notification by ID
async function getNotification(req, res, next) {
    let notification;
    try {
        notification = await Notification.findById(req.params.id);
        if (notification == null) {
            return res.status(404).json({ message: 'Notification not found' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.notification = notification;
    next();
}

module.exports = router;
