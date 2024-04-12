Créer un README détaillé est crucial pour permettre aux utilisateurs et aux développeurs de comprendre rapidement comment mettre en place et utiliser votre API, y compris son interaction avec le script Bash que nous avons développé. Voici un exemple de structure et de contenu pour un tel README :

---

# Documentation de l'API et du Script Bash `apiCli`

Ce projet contient une API réalisée avec Express.js et MongoDB, et inclut également un script Bash `apiCli` pour interagir avec l'API depuis la ligne de commande.

## Configuration de l'API

L'API utilise MongoDB pour stocker les données des utilisateurs et Swagger pour la documentation de l'API. Elle est construite sur Express.js, un framework pour applications web Node.js.

### Prérequis

- Node.js et npm installés.
- MongoDB (Utilisation d'une instance MongoDB Atlas dans cet exemple).
- Docker (pour l'exécution via Docker Compose).

### Démarrage rapide

1. **Cloner le dépôt :**

   ```bash
   git clone <URL_DU_DEPOT>
   cd <REPERTOIRE_DU_PROJET>
   ```

2. **Installation des dépendances :**

   À la racine du projet, exécutez :

   ```bash
   npm install
   ```

3. **Lancement de l'API :**

   - **Sans Docker :**

     Lancez l'API avec la commande suivante :

     ```bash
     npm start
     ```

   - **Avec Docker Compose :**

     À la racine du projet, exécutez :

     ```bash
     docker-compose up --build
     ```

     Cela construira l'image Docker de l'application et démarrera un conteneur.

### Accès à la documentation Swagger

Une fois l'API en cours d'exécution, la documentation Swagger est accessible à l'URL suivante : `http://localhost:3000/api/docs`.

## Utilisation du script Bash `apiCli`

Le script `apiCli` permet d'interagir avec l'API depuis la ligne de commande pour réaliser différentes opérations telles que créer, lire, mettre à jour, et supprimer des utilisateurs.

### Configuration

1. Assurez-vous que le script `apiCli.sh` est exécutable :

   ```bash
   chmod +x ./client/apiCli.sh
   ```

2. Par défaut, le script est configuré pour cibler l'API localement. Si nécessaire, modifiez le script pour pointer vers votre instance de l'API.

### Commandes disponibles

- **Définir l'endpoint de l'API :**

  ```bash
  ./client/apiCli.sh set <URL_DE_L'API>
  ```

- **Envoyer une requête GET pour lister tous les utilisateurs :**

  ```bash
  ./client/apiCli.sh req -get /api/users
  ```

- **Créer un nouvel utilisateur avec une requête POST :**

  ```bash
  ./client/apiCli.sh req -post /api/users -m '{"username":"testUser", "email":"test@example.com", "password":"password123"}'
  ```

### Notes supplémentaires

- Assurez-vous que l'API est en cours d'exécution avant d'utiliser le script `apiCli`.
- Les exemples de commandes ci-dessus supposent que l'API est accessible à `http://localhost:3000`. Ajustez l'URL selon votre configuration.

---

Ce modèle de README fournit un guide de démarrage, des instructions d'installation et d'utilisation, et décrit comment accéder à la documentation de l'API via Swagger. N'oubliez pas d'ajuster les URLs, les chemins et les commandes selon votre configuration spécifique et l'emplacement de vos fichiers dans le projet.