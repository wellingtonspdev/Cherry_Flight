// Cherry Bloom — Root Application & React Navigation Stack
// Source of Truth: CHERRY_BLOOM_SPECIFICATION_AND_ACCEPTANCE.md (Section 7.1 & 7.2)

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Tela1 from './src/tela1';
import Tela2 from './src/tela2';
import Tela3 from './src/tela3';
import Tela4 from './src/tela4';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Stack.Navigator
          initialRouteName="Welcome"
          screenOptions={{
            headerShown: false,
            animation: 'fade',
            contentStyle: { backgroundColor: '#FFF8F2' },
          }}
        >
          <Stack.Screen name="Welcome" component={Tela1} />
          <Stack.Screen name="Instructions" component={Tela2} />
          <Stack.Screen name="Game" component={Tela3} />
          <Stack.Screen name="Credits" component={Tela4} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
