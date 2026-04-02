pipeline {
    agent any

    environment {
        // can be used for extra configuration
        DOCKER_HOST = 'unix:///var/run/docker.sock'
    }

    stages {
        stage('Pull Updates') {
            steps {
                echo 'Pulling code from GitHub...'
                checkout scm
            }
        }

        stage('Deploy/Rebuild') {
            steps {
                echo 'Starting Docker Compose Rebuild...'
                // Using docker-compose (or docker compose) to rebuild
                // Rebuild only the specific services if needed
                sh 'docker compose up --build -d'
            }
        }
    }

    post {
        success {
            echo 'Deployment successful! 🎉'
        }
        failure {
            echo 'Deployment failed. ❌ Check the logs.'
        }
    }
}
