// Cherry Bloom — Root Application & React Navigation Stack
// Source of Truth: CHERRY_BLOOM_SPECIFICATION_AND_ACCEPTANCE.md (Section 7.1 & 7.2)

import React, { useEffect } from 'react';
import { Platform, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
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
  const isPortraitWeb = Platform.OS === 'web' && height > width;

  useEffect(() => {
    registerWebPwa();
  }, []);

  return (
    <SafeAreaProvider>
      <View style={styles.mobileRoot}>
        {isPortraitWeb ? (
          <View style={styles.orientationNotice}>
            <Text accessibilityRole="header" style={styles.orientationTitle}>Gire o dispositivo</Text>
            <Text style={styles.orientationText}>Cherry Bloom é jogado na horizontal. Use o modo paisagem para continuar.</Text>
          </View>
        ) : (
          <NavigationContainer>
            <StatusBar style="dark" />
            <Stack.Navigator
              initialRouteName="Home"
              screenOptions={{
                headerShown: false,
                animation: 'fade',
                orientation: 'landscape',
                contentStyle: { backgroundColor: '#FFF8F2' },
              }}
            >
              <Stack.Screen name="Home" component={Tela1} />
              <Stack.Screen name="Instructions" component={Tela2} />
              <Stack.Screen name="Game" component={Tela3} />
              <Stack.Screen name="Credits" component={Tela4} />
            </Stack.Navigator>
          </NavigationContainer>
        )}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  mobileRoot: {
    flex: 1,
  },
  orientationNotice: {
    flex: 1,
    backgroundColor: '#251A20',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  orientationTitle: {
    color: '#FFF8F2',
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
  },
  orientationText: {
    color: '#FFF8F2',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 12,
  },
});
