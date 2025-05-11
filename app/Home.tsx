import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Home = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome to the Food Dictate App!</Text>
      <Text style={styles.infoText}>This app helps you manage your food preferences and dietary needs.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  infoText: {
    fontSize: 16,
    marginTop: 10,
  },
});

export default Home;
