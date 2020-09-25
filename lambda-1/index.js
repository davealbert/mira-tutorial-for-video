const crypto = require('crypto')
const SQS = require('aws-sdk/clients/sqs')
const S3 = require('aws-sdk/clients/s3')

const REGION = process.env.REGION
const BUCKET_NAME = process.env.BUCKET_NAME
const sqs = new SQS({region: REGION})
const s3 = new S3({region: REGION})

function timestamp() {
  const date = new Date()
  const year = date.getFullYear()
  let month = '' + (date.getMonth() + 1)
  let day = '' + date.getDate()

  if (month.length < 2){
    month = '0' + month
  } 
  
  if (day.length < 2) {
    day = '0' + day
  }

  return `${year}${month}${day}`
}

exports.handler = async (event) => { 
  const sqsParams = {
    MessageBody: JSON.stringify({
      date: timestamp(),  // YYYYMMDD
      from: 'Lambda-1 in Mira Tutorial',
      hash: crypto.randomBytes(20).toString('hex')
    }),
    MessageGroupId: `lambda-1-to-sqs-1-${(new Date()) / 1}-${crypto.randomBytes(20).toString('hex')}`,
    QueueUrl: process.env.SQS_QUEUE_URL,
    MessageDeduplicationId: `${(new Date()) / 1}-${crypto.randomBytes(20).toString('hex')}`
  }
  
  try {
    console.log("BUCKET_NAME: ", BUCKET_NAME)
    const data = await sqs.sendMessage(sqsParams).promise()
    console.log('DATA:')
    console.log(data)

    const s3Params = {
      Bucket: BUCKET_NAME,
      Key: `data/${(new Date()) / 1}-${crypto.randomBytes(20).toString('hex')}.txt`,
      Body: JSON.stringify(sqsParams)
    }
    console.log("s3Params")
    console.log(s3Params)
    const fileResult = await s3.putObject(s3Params).promise()
    console.log(fileResult)
    return data
  } catch (ex) {
    console.log('EXCEPTION')
    console.log(ex)
    return ex
  }
}
