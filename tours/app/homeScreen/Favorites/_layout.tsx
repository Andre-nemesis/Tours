import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import Feather from '@expo/vector-icons/Feather';

export default function Favoritos() {
  const [search, setSearch] = useState('');

  const data = [
    {
      id: 1,
      nome: 'Centro Dragão do Mar',
      local: 'Fortaleza, Ce'
    },
    {
      id: 2,
      nome: 'Centro Dragão do Mar',
      local: 'Fortaleza, Ce'
    },
  ];

  const filteredData = data.filter(item =>
    item.nome.toLowerCase().includes(search.toLowerCase()) ||
    item.local.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>

      {/* TÍTULO */}
      <Text style={styles.title}>Favoritos</Text>

      {/* BARRA DE PESQUISA */}
      <View style={styles.searchBox}>
        <Feather name="search" size={20} color="#777" style={{ marginRight: 10 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquise favoritos..."
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* LISTA */}
      <ScrollView style={{ width: '100%', marginTop: 10 }}>
        {filteredData.map((item) => (
          <TouchableOpacity key={item.id} style={styles.card}>
            
            {/* Avatar com ícone */}
            <View style={styles.avatar}>
              <Image
                source={require('../../../assets/images/ellipse1.png')}
                style={styles.ellipseImage}
              />
              <Image
                source={require('../../../assets/images/ellipse2.png')}
                style={styles.ellipseImage}
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{item.nome}</Text>
              <Text style={styles.cardLocation}>{item.local}</Text>
            </View>

            {/* Seta */}
            <Feather name="chevron-right" size={22} color="#333" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDEDED',
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 80, /* Adicione padding inferior igual à altura da tabBar */
  },

  title: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 20,
  },

  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 12,
  },

  searchInput: {
    flex: 1,
    fontSize: 16,
  },

  card: {
    width: '100%',
    backgroundColor: '#FFF',
    padding: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: "#E6FFE9",
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    overflow: 'hidden', // Ensure images stay within the circle
  },
  ellipseImage: {
    width: '100%', 
    height: '100%', 
    position: 'absolute',
  },
  locationIcon: {
    position: 'absolute',
    zIndex: 1, // Ensure the icon is above the images
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },

  cardLocation: {
    fontSize: 13,
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
    left: 0,
    right: 0,
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
