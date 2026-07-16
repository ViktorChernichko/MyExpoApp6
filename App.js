import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet, View } from 'react-native';

import AppNavigator from './src/navigation/AppNavigator';
import { UserProvider } from './src/context/UserContext';
import { PostsProvider } from './src/context/PostsContext';
import { TodosProvider } from './src/context/TodosContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <View style={styles.background}>
        <UserProvider>
          <PostsProvider>
            <TodosProvider>
              <AppNavigator />
            </TodosProvider>
          </PostsProvider>
        </UserProvider>
        <StatusBar style="auto" />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, backgroundColor: '#F2F4F7' },
});
