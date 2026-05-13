import { TodoItem } from '../../api/models/todoItem';

type CreateTodoInput = {
  name: string;
};

const getTodoApiUrl = (baseUrl: string) => `${baseUrl}/api/todo`;

const parseTodoItems = async (response: Response): Promise<TodoItem[]> => {
  try {
    const payload = (await response.json()) as unknown;

    if (!Array.isArray(payload)) {
      return [];
    }

    return payload.filter(
      (entry): entry is TodoItem =>
        typeof entry === 'object' &&
        entry !== null &&
        typeof (entry as TodoItem).id === 'number' &&
        typeof (entry as TodoItem).name === 'string'
    );
  } catch {
    return [];
  }
};

export const getTodoItems = async (baseUrl: string): Promise<TodoItem[]> => {
  const response = await fetch(getTodoApiUrl(baseUrl));

  if (!response.ok) {
    return [];
  }

  return parseTodoItems(response);
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

export const deleteTodoItem = async (baseUrl: string, id: number): Promise<void> => {
  await fetch(`${getTodoApiUrl(baseUrl)}/${id}`, {
    method: 'DELETE',
  });
};
