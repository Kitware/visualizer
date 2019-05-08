#!/usr/bin/env groovy

// Define which branches Jenkins is allowed to run on
def RUN_ON_BRANCH = 'master'

// Pushes to this repository should just trigger a build in the corresponding
// branch of the OnScale_Paraview repository, as that is where this code
// gets built and deployed.
// NOTE: This pipeline does not wait for the OnScale_Paraview job to complete,
//  and will pass regardless of the end state of that build.

podTemplate(
    label: 'jenkins-pipeline',
    yaml: """
apiVersion: v1
kind: Pod
spec:
  nodeSelector:
    jenkinsbuild: true
  tolerations:
    - key: jobtype
      operator: Equal
      value: jenkinsbuild
      effect: NoSchedule
""",
    containers: [
        containerTemplate(
            name: 'jnlp',
            image: 'jenkins/jnlp-slave:3.23-1-alpine',
            args: '${computer.jnlpmac} ${computer.name}',
            workingDir: '/home/jenkins'
        )
    ],
    volumes: [
        hostPathVolume(
            hostPath: '/var/run/docker.sock',
            mountPath: '/var/run/docker.sock'
        )
    ]
) {
    node ('jenkins-pipeline') {

        // We will assign these in the first couple stages
        def isValidBranch  // Is this branch `RUN_ON_BRANCH`?
        def gitCommit  // Current git commit

        def skipMessage = "Not on appropriate branch for this stage, skipping"

        try {
            stage ('Checkout') {
                step ([$class: 'WsCleanup'])
                checkout scm

                isValidBranch = RUN_ON_BRANCH == env.BRANCH_NAME

                // Get the current git hash
                sh 'git rev-parse HEAD > commit'
                gitCommit = readFile('commit').trim().substring(0, 7)

            }
            if (isValidBranch) {
                stage ('Trigger OnScale_Paraview') {
                    build (
                        job: "../OnScale_Paraview/${env.BRANCH_NAME}",
                        wait: false
                    )
                    echo "OnScale_Paraview build running"
                }
            } else {
                echo skipMessage
            }
        } catch (e) {
            if (isValidBranch) {
                slackSendWrapper('Failed', 'danger', env.BRANCH_NAME, gitCommit)
            }
            throw (e)
        }
        if (isValidBranch) {
            slackSendWrapper('Successful', 'good', env.BRANCH_NAME, gitCommit)
        }
    }
}

def slackSendWrapper(String status, String color, String branch, String commit) {
    def url = "(<https://github.com/OnScale/visualizer/commit/${commit}|Git>)"
    slackSend (
        channel: '#onscale-cloud-manager',
        message: "Build ${status} - visualizer@${branch} ${url}",
        color: color
    )
}