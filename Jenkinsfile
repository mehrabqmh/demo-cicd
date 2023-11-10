def NODE_RUNNING
pipeline {
  agent any
    environment {
        NODE_ENV = 'development'
        PROJECT= 'test Web'
    }
  options {
    buildDiscarder(logRotator(
      numToKeepStr: '3',
      artifactNumToKeepStr: '3',
    ))
    durabilityHint('PERFORMANCE_OPTIMIZED')
  }
  stages {
    stage('Checkout Source') {
      steps {
        checkout scm
      }
    }
	stage("Build images") { 
		steps {
			script {
        docker.withRegistry('https://harbor.qmhtech.com', 'qmhdocker-harbor-access'){

        app1 = docker.build("harbor.qmhtech.com/qmhdocker/test-img-v1:${env.BUILD_ID}", "-f frontend/Dockerfile .")
        }
			}
		}
	}
	stage("Push images") {
		steps {
			script {
					docker.withRegistry('https://harbor.qmhtech.com', 'qmhdocker-harbor-access') {
					app1.push("latest")
				  app1.push("${env.BUILD_ID}")

          app1.push("latest")
          app1.push("${env.BUILD_ID}")
				}
			}
		}
	}
  stage('Deploy App') {
    steps {
          withKubeConfig([credentialsId: 'Kube-Secret' ]) {
    sh "echo app deployed successfully"
    sh "echo confirmed"

    
      }
      echo 'App deployed! successfully'
      }
    } 
  stage('clean up') {
    steps {
      script {
        cleanWs()
      }
    }
  }
    stage('Info'){
      steps {
        sh '#!/bin/bash -e\n'+'echo "\n\nThis build is based on the source below:\n\n$(echo ${GIT_URL}|sed "s|.com/|&plugins/gitiles/|")/+/${GIT_COMMIT}\n\n"'
      }
    }
}
    post {
    always {
      script {
        if (NODE_RUNNING) {
          if (!Hudson.instance.slaves.find({it.name == NODE_RUNNING})){
            build job: currentBuild.projectName, propagate: false, quietPeriod: 60, wait: false
          }
        }
      }
    }
    success {
      gerritReview labels: [Verified: 1],
          message: "Build ${env.BUILD_NUMBER} of Job ${env.JOB_NAME} succeeded!\n${env.BUILD_URL}"
    }
    failure {
      script {
        if (NODE_RUNNING) {
          if (Hudson.instance.slaves.find({it.name == NODE_RUNNING})){
            gerritReview labels: [Verified: -1],
              message: "Build ${env.BUILD_NUMBER} of Job ${env.JOB_NAME} failed.\n${env.BUILD_URL}"
          }
        }
      }
    }
    unstable {
      script {
        if (NODE_RUNNING) {
          if (Hudson.instance.slaves.find({it.name == NODE_RUNNING})){
            gerritReview labels: [Verified: -1],
              message: "Build ${env.BUILD_NUMBER} of Job ${env.JOB_NAME} was unstable.\n${env.BUILD_URL}"
          }
        }
      }
    }
  }
}
