import * as uuid from 'uuid'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { TodoAccess } from '../dataLayer/todoAccess.mjs'

const bucketName = process.env.ATTACHMENT_S3_BUCKET
const urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION)

const s3Client = new S3Client()
const todoAccess = new TodoAccess()

export async function getListTodoByUserId(userId) {
  return await todoAccess.getListTodoByUserId(userId)
}

export async function createTodo(createTodoRequest, userId) {
  const itemId = uuid.v4()
  return await todoAccess.createTodo({
    todoId: itemId,
    userId: userId,
    name: createTodoRequest.name,
    dueDate: createTodoRequest.dueDate
  })
}

export async function updateTodo(payload, todoId, userId) {
  return await todoAccess.updateTodo(payload, todoId, userId)
}

export async function deleteTodo(todoId, userId) {
  return await todoAccess.deleteTodo(todoId, userId)
}

export async function generateUploadUrl(todoId, userId) {
  const existed = await todoAccess.totoExisted(todoId, userId)
  if (!existed) {
    return {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: 'Todo does not exist'
      })
    }
  }

  const imageId = uuid.v4()
  const attachmentUrl = `https://${bucketName}.s3.amazonaws.com/${imageId}`

  await todoAccess.updateAttachmentTodo(attachmentUrl, todoId, userId)

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: imageId
  })

  const url = await getSignedUrl(s3Client, command, {
    expiresIn: urlExpiration
  })

  return url
}
