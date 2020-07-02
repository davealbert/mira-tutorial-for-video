const crypto = require('crypto')
const SQS = require('aws-sdk/clients/sqs')
const REGION = process.env.REGION
const sqs = new SQS({region: REGION})

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
  const params = {
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
    const data = await sqs.sendMessage(params).promise()
    console.log('DATA:')
    console.log(data)
    return data
  } catch (ex) {
    console.log('EXCEPTION')
    console.log(ex)
    return ex
  }
}
