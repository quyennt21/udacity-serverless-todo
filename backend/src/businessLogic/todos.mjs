import * as uuid from 'uuid'

import { TodoAccess } from '../dataLayer/todoAccess.mjs'

const todoAccess = new TodoAccess()

export async function getListTodo() {
  return todoAccess.getListTodo()
}

export async function createTodo(createTodoRequest, userId) {
  const itemId = uuid.v4()
  return await todoAccess.createTodo({
    id: itemId,
    userId: userId,
    name: createTodoRequest.name,
    dueDate: createTodoRequest.dueDate
  })
}

export async function updateTodo(todoId, userId) {}

export async function deleteTodo(todoId, userId) {}
