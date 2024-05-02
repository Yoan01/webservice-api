
const express = require('express');
const swaggerConfig = require('./swagger');
const socketIo = require('socket.io');
const http = require('http');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');
const conversationRoutes = require('./routes/conversationRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const User = require('./models/User');
const Message = require('./models/Message');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const PORT = process.env.PORT || 3000;
const uri = "mongodb+srv://admin:rootroot@webservice-api.u7zesln.mongodb.net/?retryWrites=true&w=majority&appName=Webservice-Api";

// Connexion à MongoDB
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie'))
    .catch(err => console.error('Erreur de connexion à MongoDB', err));

app.get('/', (req, res) => {
    res.send('Bienvenue sur mon backend !');
});


// Middleware
app.use(express.json());
app.use('/api', userRoutes);
app.use('/api', messageRoutes);
app.use('/api', conversationRoutes);
app.use('/api', notificationRoutes);
// Routes

swaggerConfig(app);

io.on('connection', (socket) => {
    console.log('Un utilisateur s\'est connecté');

    // Écouter l'événement d'identification de l'utilisateur
    socket.on('userIdentified', (userId) => {
        console.log(`L'utilisateur ${userId} est identifié`);

        // Associer l'ID de socket à l'ID de l'utilisateur
        User.findByIdAndUpdate(userId, { socketId: socket.id }, { new: true }, (err, user) => {
            if (err) {
                console.error('Erreur lors de l\'association de l\'ID de socket à l\'utilisateur', err);
            }
        });
    });

    // Gérer la déconnexion de l'utilisateur
    socket.on('disconnect', () => {
        console.log('Un utilisateur s\'est déconnecté');

        // Désassocier l'ID de socket de l'ID de l'utilisateur lors de la déconnexion
        User.findOneAndUpdate({ socketId: socket.id }, { socketId: null }, { new: true }, (err, user) => {
            if (err) {
                console.error('Erreur lors de la désassociation de l\'ID de socket de l\'utilisateur', err);
            }
        });
    });
});

app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
