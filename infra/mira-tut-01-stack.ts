import { MiraStack } from 'mira'
import { Construct } from '@aws-cdk/core'


import { Queue } from '@aws-cdk/aws-sqs'
import { Function as LambdaFunction, Runtime, Code } from '@aws-cdk/aws-lambda'
import { LambdaFunction as LambdaFunctionTarget } from '@aws-cdk/aws-events-targets'
import { Schedule, Rule } from '@aws-cdk/aws-events'

const AWS_REGION = 'eu-west-3'
const BASE_NAME = 'davealbert-MiraTutorial01'
const SQS_BASE_NAME = `${BASE_NAME}SQS`
const LAMBDA_ASSET_1 = '../lambda-1/lambda-1.zip'



import { AutoDeleteBucket } from '@mobileposse/auto-delete-bucket'
import { SqsDestination } from '@aws-cdk/aws-s3-notifications'
import { EventType } from '@aws-cdk/aws-s3'
import { SqsEventSource } from '@aws-cdk/aws-lambda-event-sources'
const BUCKET_NAME = `${BASE_NAME.toLowerCase()}-bucket`
const LAMBDA_ASSET_2 = '../lambda-2/lambda-2.zip'


export default class PlGithubEtlStack extends MiraStack {
  constructor(parent: Construct) {
    super(parent, PlGithubEtlStack.name, {
      disablePolicies: true
    })


    // SQS-1
    const sqs1 = new Queue(this, `${SQS_BASE_NAME}1`, {
      contentBasedDeduplication: true,
      fifo: true,
      queueName: `${SQS_BASE_NAME}1.fifo`
    })


    // Lambda-1 -- CRON Job to create SQS-1 message to kick off process
    const lambda1 = new LambdaFunction(this, `${BASE_NAME}Lambda1Handler`, {
      runtime: Runtime.NODEJS_12_X,
      code: Code.fromAsset(LAMBDA_ASSET_1),
      handler: 'index.handler',
      environment: {
        SQS_QUEUE_URL: sqs1.queueUrl,
        REGION: AWS_REGION,
        BUCKET_NAME: BUCKET_NAME
      }
    })


    const expression = Schedule.expression('cron(0/2 * ? * * *)')
    const cron = new Rule(this, `${BASE_NAME}CronForLambda2`, {
      schedule: expression
    })
    cron.addTarget(new LambdaFunctionTarget(lambda1))
    sqs1.grantSendMessages(lambda1)


    // S3
    const bucket = new AutoDeleteBucket(this, BUCKET_NAME, {
      bucketName: BUCKET_NAME,
      versioned: true
    })
    bucket.grantReadWrite(lambda1)


    // SQS-2
    const sqs2 = new Queue(this, `${SQS_BASE_NAME}2`, {
      queueName: `${SQS_BASE_NAME}2`
    })
    const sqs2Destination = new SqsDestination(sqs2)
    bucket.addEventNotification(EventType.OBJECT_CREATED, sqs2Destination, { prefix: 'data/' })


    // Lambda-2 -- CRON Job to create SQS-2 message to kick off process
    const lambda2 = new LambdaFunction(this, `${BASE_NAME}Lambda2Handler`, {
      runtime: Runtime.NODEJS_12_X,
      code: Code.fromAsset(LAMBDA_ASSET_2),
      handler: 'index.handler',
      environment: {
        REGION: AWS_REGION
      },
      events: [new SqsEventSource(sqs2)]
    })
    bucket.grantRead(lambda2)
  }
}
