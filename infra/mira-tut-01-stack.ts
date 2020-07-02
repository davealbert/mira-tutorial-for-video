import { MiraStack } from 'mira'
import { Construct } from '@aws-cdk/core'

export default class PlGithubEtlStack extends MiraStack {
  constructor(parent: Construct) {
    super(parent, PlGithubEtlStack.name, {
      disablePolicies: true
    })


    // SQS-1


    // Lambda-1 -- CRON Job to create SQS-1 message to kick off process


    // S3


    // SQS-2 


    // Lambda-2 -- Process SQS-1 message from SQS-1 and write file to S3
    
    
  }
}
