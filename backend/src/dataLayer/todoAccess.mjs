import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import AWSXRay from 'aws-xray-sdk-core'

export class TodoAccess {
  constructor(
    documentClient = AWSXRay.captureAWSv3Client(new DynamoDB()),
    todoTable = process.env.TODO_TABLE
  ) {
    this.documentClient = documentClient
    this.todoTable = todoTable
    this.dynamoDbClient = DynamoDBDocument.from(this.documentClient)
  }

  async getTodoById(todoId, userId) {
    return await this.dynamoDbClient.get({
      TableName: this.todoTable,
      Key: {
        todoId: todoId,
        userId: userId
      }
    })
  }

  async getListTodoByUserId(userId) {
    const result = await this.dynamoDbClient.query({
      TableName: this.todoTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      },
      ScanIndexForward: false
    })
    return result.Items
  }

  async createTodo(data) {
    const result = await this.dynamoDbClient.put({
      TableName: this.todoTable,
      Item: data
    })
    return result.Attributes
  }

  async updateTodo(data, todoId, userId) {
    const result = await this.dynamoDbClient.update({
      TableName: this.todoTable,
      Key: {
        userId: userId,
        todoId: todoId
      },
      UpdateExpression: 'set #n = :name, dueDate = :dueDate, done = :done',
      ExpressionAttributeValues: {
        ':name': data.name,
        ':dueDate': data.dueDate,
        ':done': data.done
      },
      ExpressionAttributeNames: {
        '#n': 'name'
      },
      ReturnValues: 'UPDATED_NEW'
    })
    return result?.Attributes
  }

  async deleteTodo(todoId, userId) {
    const result = await this.dynamoDbClient.delete({
      TableName: this.todoTable,
      Key: {
        todoId: todoId,
        userId: userId
      }
    })
    return result.Attributes
  }
}
