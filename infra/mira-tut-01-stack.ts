import { MiraStack } from 'mira'
import { Construct } from '@aws-cdk/core'

export default class PlGithubEtlStack extends MiraStack {
  constructor(parent: Construct) {
    super(parent, PlGithubEtlStack.name, {
      disablePolicies: true
    })


    // SQS-1


    // Lambda-1 -- CRON Job to create SQS-1 message to kick off process


    
  }
}
