
const express = require('express');
const swaggerConfig = require('./swagger');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const app = express();
const PORT = process.env.PORT || 3000;
const uri = "mongodb+srv://admin:rootroot@webservice-api.u7zesln.mongodb.net/?retryWrites=true&w=majority&appName=Webservice-Api";

// Connexion à MongoDB
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie'))
    .catch(err => console.error('Erreur de connexion à MongoDB', err));

// Middleware
app.use(express.json());
app.use('/api/docs', swaggerConfig.swaggerUi.serve, swaggerConfig.swaggerUi.setup(swaggerConfig.specs));
app.use('/api', userRoutes);


// Routes
// Exemple de route
app.get('/api', (req, res) => {
    res.send('Bienvenue sur mon backend !');
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
