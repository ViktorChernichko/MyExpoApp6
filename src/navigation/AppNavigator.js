import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text } from 'react-native';

import UsersListScreen from '../screens/UsersListScreen';
import UserDetailScreen from '../screens/UserDetailScreen';
import PostsScreen from '../screens/PostsScreen';
import TodosScreen from '../screens/TodosScreen';

const Tab = createBottomTabNavigator();
const UsersStack = createNativeStackNavigator();

function UsersStackNavigator() {
  return (
    <UsersStack.Navigator>
      <UsersStack.Screen
        name="UsersList"
        component={UsersListScreen}
        options={{ title: 'Користувачі' }}
      />
      <UsersStack.Screen
        name="UserDetail"
        component={UserDetailScreen}
        options={{ title: 'Деталі користувача' }}
      />
    </UsersStack.Navigator>
  );
}

const ICONS = { Users: '👤', Posts: '📝', Todos: '✅' };

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: route.name !== 'Users',
          tabBarActiveTintColor: '#4A90D9',
          tabBarIcon: ({ size }) => (
            <Text style={{ fontSize: size - 4 }}>{ICONS[route.name]}</Text>
          ),
        })}
      >
        <Tab.Screen name="Users" component={UsersStackNavigator} options={{ title: 'Користувачі' }} />
        <Tab.Screen name="Posts" component={PostsScreen} options={{ title: 'Пости' }} />
        <Tab.Screen name="Todos" component={TodosScreen} options={{ title: 'Завдання' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
