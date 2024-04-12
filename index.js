const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3000;

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/ma-base-de-donnees', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie'))
    .catch(err => console.error('Erreur de connexion à MongoDB', err));

// Middleware
app.use(express.json());

// Routes
// Exemple de route
app.get('/', (req, res) => {
    res.send('Bienvenue sur mon backend !');
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
