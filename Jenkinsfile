// Load the shared library written for the pipeline
@Library('shared-jenkins-lib') _

defaultPipeline {
  VALUES_FILE_DEV = "ganeyi/web.dev.values.yaml"
  VALUES_FILE_STAGING = "ganeyi-staging/web.staging.values.yaml"
  VALUES_FILE_MASTER= "ganeyi-prod/values-console-prod.yaml"
  appName = "ganeyi-web-client"
  GIT_DEVOPS_PWD = credentials('GITHUB_DEVOPS_PASSWORD')
  GIT_DEVOPS_USER = credentials('GITHUB_DEVOPS_USER')
  registry = 'baamtu/ganeyi-web-client'
  slackChannelNotification = 'ganeyi_dev'
  APP_STACK = 'ANGULAR'
  dockerFileContext = '.'
}
