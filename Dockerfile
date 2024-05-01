# Utilisez l'image de base Node.js pour construire l'application
FROM node:14 as build

# Créez un répertoire de travail pour l'application
WORKDIR /app

# Copiez les fichiers de package.json et package-lock.json (ou yarn.lock)
COPY package*.json ./

# Installez les dépendances
RUN npm install

# Copiez le reste des fichiers de l'application
COPY . .

# Exécutez les tests
#RUN npm run test

# Exécutez l'analyse SonarQube
#RUN sonar-scanner \
   # -Dsonar.projectKey=VotreProjetKey \
    #"-Dsonar.sources=. \
    #-Dsonar.host.url=http://localhost:9000 \
    #-Dsonar.login=VotreTokenSecret

# Exécutez la construction de l'application
RUN npm run build

# Utilisez une image légère de production Node.js
FROM node:16

# Définissez le répertoire de travail pour l'application dans l'image de production
WORKDIR /app

# Copiez les fichiers de package.json et package-lock.json (ou yarn.lock)
COPY package*.json ./

# Installez uniquement les dépendances de production
RUN npm install --only=production

# Copiez la construction de l'application depuis l'étape de construction
COPY --from=build /app/dist ./dist

# Exposez le port sur lequel l'application s'exécute
EXPOSE 3000

# Commande pour démarrer l'application en production
CMD ["node", "dist/main.js"]
