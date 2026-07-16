import axios from 'axios';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

export const fetchUsers = async () => {
  const response = await fetch(`${BASE_URL}/users`);
  if (!response.ok) throw new Error('Помилка завантаження користувачів');
  return response.json();
};

export const fetchUserById = async (id) => {
  const response = await fetch(`${BASE_URL}/users/${id}`);
  if (!response.ok) throw new Error('Помилка завантаження користувача');
  return response.json();
};

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

export const fetchPosts = async () => {
  const response = await api.get('/posts');
  return response.data;
};

export const fetchTodos = async () => {
  const response = await api.get('/todos');
  return response.data;
};

export const updateTodoStatus = async (id, completed) => {
  const response = await api.patch(`/todos/${id}`, { completed });
  return response.data;
};

export default api;
