import { TodoItem } from '../../../api/models/todoItem';

type CreateTodoInput = {
  name: string;
};

const getTodoApiUrl = (baseUrl: string) => `${baseUrl}/api/todo`;


export const getTodoItems = async (baseUrl: string): Promise<TodoItem[]> => {
  const response = await fetch(getTodoApiUrl(baseUrl));

  if (!response.ok) {
    return [];
  }

  return response.json();
};

export const createTodoItem = async (
  baseUrl: string,
  input: CreateTodoInput
): Promise<void> => {
  await fetch(getTodoApiUrl(baseUrl), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });
};

export const deleteTodoItem = async (baseUrl: string, id: string): Promise<void> => {
  await fetch(`${getTodoApiUrl(baseUrl)}/${id}`, {
    method: 'DELETE',
  });
};