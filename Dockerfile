# Utilisation d'un serveur Nginx léger et rapide
FROM nginx:alpine

# Copier la page web vers le chemin par défaut du serveur
COPY index.html /usr/share/nginx/html/index.html

# Ouvrir le port 80
EXPOSE 80
