// API client configuration and functions
const BASE_URL = 'https://disturbing-melisa-abz-1b4e6d85.koyeb.app';

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

export interface User {
  username: string;
  id: number;
}

// Helper function to encode credentials for Basic Auth
const getAuthHeader = (username: string, password: string) => {
  const credentials = btoa(`${username}:${password}`);
  return `Basic ${credentials}`;
};

// User API functions
export const registerUser = async (username: string, password: string) => {
  const response = await fetch(`${BASE_URL}/users/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });
  if (!response.ok) throw new Error('Registration failed');
  return response.json();
};

export const getCurrentUser = async (username: string, password: string) => {
  const response = await fetch(`${BASE_URL}/users/me/`, {
    headers: {
      'Authorization': getAuthHeader(username, password),
    },
  });
  if (!response.ok) throw new Error('Failed to get user info');
  return response.json();
};

// Todo API functions
export const getTodos = async (username: string, password: string) => {
  const response = await fetch(`${BASE_URL}/todos`, {
    headers: {
      'Authorization': getAuthHeader(username, password),
    },
  });
  if (!response.ok) throw new Error('Failed to fetch todos');
  return response.json();
};

export const createTodo = async (username: string, password: string, todo: { title: string }) => {
  const response = await fetch(`${BASE_URL}/todos`, {
    method: 'POST',
    headers: {
      'Authorization': getAuthHeader(username, password),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(todo),
  });
  if (!response.ok) throw new Error('Failed to create todo');
  return response.json();
};

export const updateTodo = async (username: string, password: string, todoId: number, updates: Partial<Todo>) => {
  const response = await fetch(`${BASE_URL}/todos/${todoId}`, {
    method: 'PUT',
    headers: {
      'Authorization': getAuthHeader(username, password),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });
  if (!response.ok) throw new Error('Failed to update todo');
  return response.json();
};

export const deleteTodo = async (username: string, password: string, todoId: number) => {
  const response = await fetch(`${BASE_URL}/todos/${todoId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': getAuthHeader(username, password),
    },
  });
  if (!response.ok) throw new Error('Failed to delete todo');
  return response.json();
};
