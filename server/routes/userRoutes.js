
const express = require('express');
const router = express.Router();
const User = require('../models/user');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API for managing users
 */

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Crée un nouvel utilisateur
 *     description: Crée un nouvel utilisateur avec les informations fournies
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *       400:
 *         description: Erreur lors de la création de l'utilisateur
 */
router.post('/users', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Récupère tous les utilisateurs
 *     description: Récupère tous les utilisateurs enregistrés dans la base de données
 *     responses:
 *       200:
 *         description: Utilisateurs récupérés avec succès
 *       500:
 *         description: Erreur lors de la récupération des utilisateurs
 */
router.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Récupère un utilisateur par son ID
 *     description: Récupère un utilisateur spécifique en fonction de l'ID fourni
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID de l'utilisateur à récupérer
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Utilisateur récupéré avec succès
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur lors de la récupération de l'utilisateur
 */
router.get('/users/:id', getUser, (req, res) => {
    res.json(res.user);
});


/**
 * @swagger
 * /api/users/{id}:
 *   patch:
 *     summary: Met à jour un utilisateur
 *     description: Met à jour les informations d'un utilisateur spécifique en fonction de l'ID fourni
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID de l'utilisateur à mettre à jour
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour avec succès
 *       400:
 *         description: Erreur lors de la mise à jour de l'utilisateur
 *       404:
 *         description: Utilisateur non trouvé
 */
router.patch('/users/:id', getUser, async (req, res) => {
    if (req.body.username != null) {
        res.user.username = req.body.username;
    }
    if (req.body.email != null) {
        res.user.email = req.body.email;
    }
    if (req.body.password != null) {
        res.user.password = req.body.password;
    }
    try {
        const updatedUser = await res.user.save();
        res.json(updatedUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Supprime un utilisateur
 *     description: Supprime un utilisateur spécifique en fonction de l'ID fourni
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID de l'utilisateur à supprimer
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Utilisateur supprimé avec succès
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur lors de la suppression de l'utilisateur
 */
router.delete('/users/:id', getUser, async (req, res) => {
    try {
        await res.user.remove();
        res.json({ message: 'Utilisateur supprimé' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


async function getUser(req, res, next) {
    let user;
    try {
        user = await User.findById(req.params.id);
        if (user == null) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ message: 'ID d\'utilisateur invalide' });
        }
        return res.status(500).json({ message: err.message });
    }

    res.user = user;
    next();
}

module.exports = router;
