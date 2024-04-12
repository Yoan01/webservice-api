# Utiliser l'image officielle Node.js comme image de base
FROM node:16

# Définir le répertoire de travail dans le conteneur
WORKDIR /usr/src/app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier les fichiers et répertoires restants dans le répertoire de travail actuel
COPY . .

# Exposer le port 3000
EXPOSE 3000

# Commander le conteneur pour exécuter l'application
CMD [ "node", "app.js" ]
