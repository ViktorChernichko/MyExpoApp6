import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useTodosContext } from '../context/TodosContext';
import { fetchTodos } from '../api/api';

export default function TodosScreen() {
  const {
    todos,
    setTodos,
    loading,
    setLoading,
    error,
    setError,
    toggleTodoStatus,
    updatingIds,
  } = useTodosContext();

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTodos();
      setTodos(data.slice(0, 30));
    } catch (err) {
      setError('Не вдалося завантажити завдання');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4A90D9" />
      </View>
    );
  }

  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <View style={styles.container}>
      {error && <Text style={styles.errorBanner}>{error}</Text>}
      <Text style={styles.summary}>
        Виконано {completedCount} з {todos.length}
      </Text>
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => toggleTodoStatus(item)}
            disabled={updatingIds.includes(item.id)}
          >
            <View style={[styles.checkbox, item.completed && styles.checkboxChecked]}>
              {updatingIds.includes(item.id) ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                item.completed && <Text style={styles.checkmark}>✓</Text>
              )}
            </View>
            <Text style={[styles.todoTitle, item.completed && styles.todoTitleDone]}>
              {item.title}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  summary: { fontSize: 13, color: '#888', marginBottom: 10 },
  errorBanner: {
    backgroundColor: '#FDECEA',
    color: '#D9534F',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 12,
  },
  list: { paddingBottom: 20 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#4A90D9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxChecked: { backgroundColor: '#4A90D9' },
  checkmark: { color: '#fff', fontWeight: '700', fontSize: 14 },
  todoTitle: { flex: 1, fontSize: 14, color: '#1a1a1a' },
  todoTitleDone: { textDecorationLine: 'line-through', color: '#999' },
});
