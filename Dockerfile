# Image Python légère et optimisée
FROM python:3.11-slim

# Répertoire de travail dans le conteneur
WORKDIR /app

# Copier les dépendances en premier pour profiter du cache Docker
COPY requirements.txt .

# Installer les dépendances Python
RUN pip install --no-cache-dir -r requirements.txt

# Copier tout le reste du projet
COPY . .

# Exposer le port de l'API Flask
EXPOSE 5000

# Lancer l'API avec Gunicorn (serveur de production)
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "2", "--timeout", "120", "api:app"]
