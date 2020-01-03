pipeline {
  agent any
  stages {
    stage('Build otpService') {
      /*when {
        anyOf {
          changeset "otpService/*"
        }
    }*/
 /*     steps {
        println("otpService changed")
        println("Building otpService")
        bat label: '', script: '''cd otpService 
                                  pm2 stop
                                  npm install
                                  pm2 restart'''
      }*/
      steps {/*
            echo 'Stage 1 : Installing Latest Dependencies'
            bat label: '', script: '''npm install'''*/
            
            echo 'Stage 4 : Restarting server'
            bat label: '', script: 'pm2 start server.js --name otpService --watch'
        }
    }
  }
}
