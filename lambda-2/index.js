const crypto = require('crypto')
const SQS = require('aws-sdk/clients/sqs')
const REGION = process.env.REGION
const sqs = new SQS({region: REGION})

exports.handler = async (event) => { 
}