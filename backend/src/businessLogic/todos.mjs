import * as uuid from 'uuid'

import { TodoAccess } from '../dataLayer/todoAccess.mjs'

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
