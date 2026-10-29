pipeline {
    agent any

    environment {
        DOCKERHUB_USERNAME = 'niranjans1822'
        IMAGE_NAME = 'niranjans1822/crm-app'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npm test'
            }
        }

        stage('Docker Build') {
            steps {
                script {
                    def branchTag = (env.BRANCH_NAME == 'main') ? 'latest' : env.BRANCH_NAME
                    echo "Building Docker image: ${IMAGE_NAME}:${branchTag}"
                    sh "docker build -t ${IMAGE_NAME}:${branchTag} ."
                }
            }
        }

        stage('Docker Push') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh 'echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin'
                    script {
                        def branchTag = (env.BRANCH_NAME == 'main') ? 'latest' : env.BRANCH_NAME
                        echo "Pushing Docker image: ${IMAGE_NAME}:${branchTag}"
                        sh "docker push ${IMAGE_NAME}:${branchTag}"
                    }
                }
            }
        }
    }

    post {
        always {
            echo "Build finished for branch ${env.BRANCH_NAME}"
        }
        success {
            echo "Pipeline succeeded for branch ${env.BRANCH_NAME} [Roll No: 24MIS0407]"
        }
        failure {
            echo "Pipeline failed for branch ${env.BRANCH_NAME}"
        }
    }
}
