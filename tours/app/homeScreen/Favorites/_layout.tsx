import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import favoritesService from '../../../services/favorites';
import ConfirmModal from '../../../components/ConfirmModal';
import { on, off } from '../../../services/eventBus';
import LocationDetailsModal from '../../../components/LocationDetailsModal';
import api from '../../../services/api';

export default function Favoritos() {
  const [search, setSearch] = useState('');
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [toRemove, setToRemove] = useState<{ locId?: string; locName?: string } | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    loadFavorites();
    const unsub = on('favoritesChanged', () => {
      loadFavorites();
    });
    return () => { unsub(); };
  }, []);

  async function loadFavorites() {
    setLoading(true);
    try {
      const res = await favoritesService.getFavorites();
      console.log('favorites response', res);
      const processed = Array.isArray(res) ? res.map((f) => ({ ...f, location: f.location || null })) : [];
      console.log('processed favorites count', processed.length, processed.map(p => ({ id: p.id, locationId: p.location?.id })));
      setFavorites(processed);
    } catch (e) {
      console.warn('Erro ao carregar favoritos', e);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  }

  const getPhotoUri = (photo: any) => {
    const fallback = 'https://images.unsplash.com/photo-1505761671935-60b3a7427bad';
    if (!photo) return fallback;
    try {
      const p = String(photo);
      if (p.startsWith('http') || p.startsWith('data:')) return p;
      const base = (api.defaults.baseURL || 'http://localhost:3000').replace(/\/$/, '');
      return `${base}/${p.replace(/^\//, '')}`;
    } catch (e) {
      return String(photo);
    }
  };

  const filteredData = favorites.filter((item) => {
    const nome = (item.location && item.location.name) ? item.location.name : '';
    const rawAddress = (item.location && item.location.address) ? item.location.address : '';
    const local = typeof rawAddress === 'string' ? rawAddress : (rawAddress && typeof rawAddress === 'object' ? (rawAddress.formatted || rawAddress.street || `${rawAddress.lat || ''} ${rawAddress.long || ''}`) : '');
    return nome.toLowerCase().includes(search.toLowerCase()) || local.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <View style={styles.container}>

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
        {loading && <ActivityIndicator size="small" color="#22c55e" style={{ margin: 12 }} />}
        {!loading && filteredData.length === 0 && (
          <Text style={{ color: '#777', marginTop: 12 }}>Nenhum favorito encontrado.</Text>
        )}

        {filteredData.map((item) => {
          const loc = item.location || {};
          return (
            <TouchableOpacity key={item.id} style={styles.card} onPress={() => { setSelectedId(loc.id); setModalVisible(true); }}>
              <View style={styles.avatar}>
                <Image
                  source={{ uri: getPhotoUri(loc.photo) }}
                  style={styles.avatarImage}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{loc.name || 'Local sem nome'}</Text>
                <Text style={styles.cardLocation}>{
                  (() => {
                    const a = loc.address;
                    if (!a) return '';
                    if (typeof a === 'string') return a;
                    if (typeof a === 'object') {
                      return a.formatted || a.street || (a.city ? `${a.city}${a.state ? ', ' + a.state : ''}` : `${a.lat || ''} ${a.long || ''}`) || '';
                    }
                    return '';
                  })()
                }</Text>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity
                  onPress={() => {
                    setToRemove({ locId: loc.id, locName: loc.name });
                    setConfirmVisible(true);
                  }}
                  style={{ marginRight: 10 }}
                >
                  <Feather name="trash-2" size={20} color="#e11d48" />
                </TouchableOpacity>

                <Feather name="chevron-right" size={22} color="#333" />
              </View>
            </TouchableOpacity>
          );
        })}
        <LocationDetailsModal visible={modalVisible} locationId={selectedId || undefined} onClose={() => setModalVisible(false)} />
      </ScrollView>
      <ConfirmModal
        visible={confirmVisible}
        title="Remover favorito"
        message={toRemove?.locName ? `Tem certeza que deseja remover "${toRemove.locName}" dos favoritos?` : 'Tem certeza que deseja remover este favorito?'}
        confirmText="Remover"
        cancelText="Cancelar"
        onCancel={() => { setConfirmVisible(false); setToRemove(null); }}
        onConfirm={async () => {
          if (!toRemove?.locId) {
            setConfirmVisible(false);
            setToRemove(null);
            return;
          }
          try {
            await favoritesService.removeFavorite(toRemove.locId);
            setFavorites((prev) => prev.filter((f) => f.location?.id !== toRemove.locId));
          } catch (e) {
            console.warn('Erro ao remover favorito', e);
          } finally {
            setConfirmVisible(false);
            setToRemove(null);
          }
        }}
      />
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
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
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
