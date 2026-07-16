import React, { createContext, useState, useContext } from 'react';
import { updateTodoStatus } from '../api/api';

const TodosContext = createContext();

export const TodosProvider = ({ children }) => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updatingIds, setUpdatingIds] = useState([]);

  const toggleTodoStatus = async (todo) => {
    const newStatus = !todo.completed;

    setTodos((prev) =>
      prev.map((t) => (t.id === todo.id ? { ...t, completed: newStatus } : t))
    );
    setUpdatingIds((prev) => [...prev, todo.id]);
    setError(null);

    try {
      await updateTodoStatus(todo.id, newStatus);
    } catch (err) {
      setTodos((prev) =>
        prev.map((t) =>
          t.id === todo.id ? { ...t, completed: !newStatus } : t
        )
      );
      setError('Не вдалося оновити статус завдання. Спробуйте ще раз.');
    } finally {
      setUpdatingIds((prev) => prev.filter((id) => id !== todo.id));
    }
  };

  return (
    <TodosContext.Provider
      value={{
        todos,
        setTodos,
        loading,
        setLoading,
        error,
        setError,
        toggleTodoStatus,
        updatingIds,
      }}
    >
      {children}
    </TodosContext.Provider>
  );
};

export const useTodosContext = () => {
  const context = useContext(TodosContext);
  if (!context) {
    throw new Error('useTodosContext must be used within a TodosProvider');
  }
  return context;
};
