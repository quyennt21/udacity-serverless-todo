import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { v4 as uuidv4 } from 'uuid'

const bucketName = process.env.ATTACHMENT_S3_BUCKET
const urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION)

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      origin: '*',
      credentials: true
    })
  )
  .handler(async (event) => {
    console.log('Processing event: ', event)
    const todoId = event.pathParameters.todoId
    // const command = new PutObjectCommand({
    //   Bucket: bucketName,
    //   Key: imageId
    // })

    // const url = await getSignedUrl(s3Client, command, {
    //   expiresIn: urlExpiration
    // })
    // return url

    // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        items: results
      })
    }
  })
