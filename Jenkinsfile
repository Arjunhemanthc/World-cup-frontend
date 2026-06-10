pipeline {
    agent any

    environment {
        IMAGE = "worldcup-frontend-ui:${BUILD_NUMBER}"
        CONT = "worldcup-frontend-ui"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                bat "docker build -t %IMAGE% ."
            }
        }

        stage('Run Frontend Container') {
            steps {
                // Stops and drops any old container running on port 8083 gracefully
                bat "docker rm -f %CONT% 2>nul || exit 0"
                
                // Maps your machine's port 8083 to internal Nginx port 80
                bat "docker run -d --name %CONT% -p 8083:80 %IMAGE%"
            }
        }
    }

    post {
        success {
            echo "======================================================="
            echo "🎉 WorldCup Frontend UI Deployed Successfully!"
            echo "Access your complete application at: http://localhost:8083"
            echo "======================================================="
        }
        failure {
            echo "❌ Build failed. Please inspect the Console Output logs."
        }
    }
}