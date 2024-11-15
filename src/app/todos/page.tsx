'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getTodos, createTodo, updateTodo, deleteTodo, Todo } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const { isAuthenticated, credentials, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    fetchTodos();
  }, [isAuthenticated]);

  const fetchTodos = async () => {
    if (!credentials) return;
    try {
      const todosData = await getTodos(credentials.username, credentials.password);
      setTodos(todosData);
    } catch (error) {
      console.error('Failed to fetch todos:', error);
    }
  };

  const handleCreateTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!credentials || !newTodoTitle.trim()) return;

    try {
      await createTodo(credentials.username, credentials.password, {
        title: newTodoTitle,
      });
      setNewTodoTitle('');
      fetchTodos();
    } catch (error) {
      console.error('Failed to create todo:', error);
    }
  };

  const handleToggleComplete = async (todo: Todo) => {
    if (!credentials) return;

    try {
      await updateTodo(credentials.username, credentials.password, todo.id, {
        ...todo,
        completed: !todo.completed,
      });
      fetchTodos();
    } catch (error) {
      console.error('Failed to update todo:', error);
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    if (!credentials) return;

    try {
      await deleteTodo(credentials.username, credentials.password, todoId);
      fetchTodos();
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">My Todos</h1>
          <button
            onClick={logout}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        {/* Create Todo Form */}
        <form onSubmit={handleCreateTodo} className="mt-8">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="What needs to be done?"
              value={newTodoTitle}
              onChange={(e) => setNewTodoTitle(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Todo
            </button>
          </div>
        </form>

        {/* Todo List */}
        <div className="mt-8 space-y-4">
          {todos.map((todo) => (
            <div
              key={todo.id}
              className="bg-white shadow rounded-lg p-4 flex items-center justify-between"
            >
              <div className="flex items-center space-x-4">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggleComplete(todo)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <h3
                  className={`text-lg font-medium ${
                    todo.completed ? 'text-gray-400 line-through' : 'text-gray-900'
                  }`}
                >
                  {todo.title}
                </h3>
              </div>
              <button
                onClick={() => handleDeleteTodo(todo.id)}
                className="text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
