import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Maps() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mapas</Text>
      <Text style={styles.subtitle}>Tela de mapas — placeholder</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 20,
    backgroundColor: '#EDEDED',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});
