import React, { useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { usePostsContext } from '../context/PostsContext';
import { fetchPosts } from '../api/api';

const FILTERS = [
  { key: 'all', label: 'Всі' },
  { key: 'short', label: 'Короткі (<150)' },
  { key: 'medium', label: 'Середні (150-250)' },
  { key: 'long', label: 'Довгі (>250)' },
];

export default function PostsScreen() {
  const {
    setPosts,
    searchQuery,
    setSearchQuery,
    lengthFilter,
    setLengthFilter,
    filteredPosts,
    loading,
    setLoading,
    error,
    setError,
  } = usePostsContext();

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPosts();
      setPosts(data);
    } catch (err) {
      setError('Не вдалося завантажити пости');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Пошук за заголовком..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <View style={styles.filterRow}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f.key}
            style={[styles.filterChip, lengthFilter === f.key && styles.filterChipActive]}
            onPress={() => setLengthFilter(f.key)}
          >
            <Text
              style={[
                styles.filterChipText,
                lengthFilter === f.key && styles.filterChipTextActive,
              ]}
            >
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#4A90D9" style={{ marginTop: 20 }} />
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadPosts}>
            <Text style={styles.retryButtonText}>Спробувати ще раз</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <Text style={styles.resultsCount}>Знайдено: {filteredPosts.length}</Text>
          <FlatList
            data={filteredPosts}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.postTitle}>{item.title}</Text>
                <Text style={styles.postBody} numberOfLines={3}>
                  {item.body}
                </Text>
                <Text style={styles.postLength}>Довжина: {item.body.length} символів</Text>
              </View>
            )}
            ListEmptyComponent={<Text style={styles.emptyText}>Постів не знайдено</Text>}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 40 },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 8,
    marginBottom: 8,
  },
  filterChipActive: { backgroundColor: '#4A90D9', borderColor: '#4A90D9' },
  filterChipText: { fontSize: 12, color: '#555' },
  filterChipTextActive: { color: '#fff', fontWeight: '600' },
  resultsCount: { color: '#888', fontSize: 12, marginBottom: 8 },
  list: { paddingBottom: 20 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  postTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 6,
    textTransform: 'capitalize',
  },
  postBody: { fontSize: 13, color: '#666', lineHeight: 18 },
  postLength: { fontSize: 11, color: '#4A90D9', marginTop: 8, fontWeight: '500' },
  errorText: { color: '#D9534F', marginBottom: 12, fontSize: 15 },
  retryButton: { backgroundColor: '#4A90D9', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  retryButtonText: { color: '#fff', fontWeight: '600' },
  emptyText: { textAlign: 'center', color: '#999', marginTop: 30 },
});
