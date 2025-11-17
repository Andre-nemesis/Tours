import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function Conta({ goToInicio, goToMapas, goToFavoritos, goToConta }) {
  return (
    <View style={styles.container}>
      {/* HEADER */}
      <Text style={styles.title}>Conta</Text>

      {/* USER PROFILE */}
      <View style={styles.profileContainer}>
        <Image
          source={require('../../../assets/images/ellipse2.png')} // Using ellipse2.png
          style={styles.ellipse2}
        />
        <Text style={styles.userName}>Caroline Melo</Text>
        <Text style={styles.userEmail}>caroline.melo@email.com</Text>
      </View>

      {/* ACTION BUTTONS */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Editar conta</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.deleteButton]}>
          <Text style={styles.actionButtonText}>Excluir conta</Text>
        </TouchableOpacity>
      </View>

      {/* STATS */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>5</Text>
          <Text style={styles.statLabel}>Lugares visitados</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>2</Text>
          <Text style={styles.statLabel}>Favoritos</Text>
        </View>
      </View>

      {/* TAB BAR */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem} onPress={goToInicio}>
          <Ionicons name="home-outline" size={24} color="#555" />
          <Text style={styles.tabLabel}>Início</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={goToMapas}>
          <Ionicons name="map-outline" size={24} color="#555" />
          <Text style={styles.tabLabel}>Mapas</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={goToFavoritos}>
          <Ionicons name="heart-outline" size={24} color="#555" />
          <Text style={styles.tabLabel}>Favoritos</Text>
        </TouchableOpacity>

        {/* Aba ativa */}
        <TouchableOpacity style={[styles.tabItem, styles.tabActive]} onPress={goToConta}>
          <Ionicons name="person" size={26} color="#22c55e" />
          <Text style={styles.tabLabelActive}>Conta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDEDED',
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 80, // Height of tab bar
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 30,
    alignSelf: 'flex-start',
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  ellipse2: { // New style for ellipse2.png, replicating previous avatar styles
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  userEmail: {
    fontSize: 14,
    color: '#777',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 30,
  },
  actionButton: {
    backgroundColor: '#FFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    width: '48%',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#FEE2E2',
  },
  actionButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingVertical: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  statLabel: {
    fontSize: 14,
    color: '#777',
  },
  /* TAB BAR */
  tabBar: {
    width: '100%',
    height: 80,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderColor: '#DDD',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
  },
  tabItem: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    height: 70,
    borderRadius: 15,
  },
  tabLabel: {
    fontSize: 12,
    color: '#555',
    marginTop: 3,
  },
  tabActive: {
    backgroundColor: '#C4FDD4',
  },
  tabLabelActive: {
    fontSize: 12,
    marginTop: 3,
    color: '#22c55e',
    fontWeight: '600',
  },
});
