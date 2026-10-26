// Cherry Bloom — Root Application & React Navigation Stack
// Source of Truth: CHERRY_BLOOM_SPECIFICATION_AND_ACCEPTANCE.md (Section 7.1 & 7.2)

import React, { useEffect } from 'react';
import { Platform, StyleSheet, useWindowDimensions, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { registerWebPwa } from './src/game/pwa';
import Tela1 from './src/tela1';
import Tela2 from './src/tela2';
import Tela3 from './src/tela3';
import Tela4 from './src/tela4';

const Stack = createNativeStackNavigator();

export default function App() {
  const { width, height } = useWindowDimensions();
  const isWideWeb = Platform.OS === 'web' && width > 540;

  useEffect(() => {
    registerWebPwa();
  }, []);

  return (
    <SafeAreaProvider>
      <View style={isWideWeb ? styles.desktopBackdrop : styles.mobileRoot}>
        <View
          style={
            isWideWeb
              ? [
                  styles.arcadeCabinet,
                  {
                    height: Math.min(Math.max(580, height - 32), 860),
                  },
                ]
              : styles.mobileRoot
          }
        >
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
        </View>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  mobileRoot: {
    flex: 1,
  },
  desktopBackdrop: {
    flex: 1,
    backgroundColor: '#251A20',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  arcadeCabinet: {
    width: '100%',
    maxWidth: 460,
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#FFB7C5',
    backgroundColor: '#FFF8F2',
  },
});
