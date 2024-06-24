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

  async getListTodoByUserId(userId) {
    const result = await this.dynamoDbClient.query({
      TableName: this.todoTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':groupId': userId
      },
      ScanIndexForward: false
    })
  
    return result.Items
  }

  async createTodo(data, userId) {
    await this.dynamoDbClient.put({
      TableName: this.todoTable,
      Item: data
    })
    return data
  }

  async updateTodo(data, userId) {

  }

  async deleteTodo(todoId, userId) {

  }
}
