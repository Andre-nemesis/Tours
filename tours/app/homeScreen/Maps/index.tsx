import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Dimensions, Platform, TouchableOpacity, Linking } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import api from '../../../services/api';
import favoritesService from '../../../services/favorites';
import { on, off } from '../../../services/eventBus';

type Location = {
  id: string;
  name: string;
  address: {
    lat?: string | number;
    long?: string | number;
    [key: string]: any;
  };
  photo?: string;
};

export default function MapsScreen() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCoord, setSelectedCoord] = useState<{ latitude: number; longitude: number } | null>(null);
  const [adding, setAdding] = useState<Record<string, boolean>>({});
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let mounted = true;
    const loadUserFavorites = async () => {
      try {
        const favs = await favoritesService.getFavorites();
        if (!mounted) return;
        if (Array.isArray(favs)) {
          const map: Record<string, boolean> = {};
          favs.forEach((f: any) => {
            const lid = f.location?.id;
            if (lid) map[lid] = true;
          });
          setAddedIds(map);
        }
      } catch (e) {
        console.warn('Erro ao carregar favoritos do usuário (Maps):', e);
      }
    };
    loadUserFavorites();
    const unsub = on('favoritesChanged', () => {
      // reload current favorites map
      loadUserFavorites();
    });
    return () => { unsub(); mounted = false; };
  }, []);
  const isWeb = Platform.OS === 'web';
  const mapRef = useRef<any>(null);
  const [MapViewComp, setMapViewComp] = useState<any>(null);
  const [MarkerComp, setMarkerComp] = useState<any>(null);
  
  useEffect(() => {
    let mounted = true;
    const fetchLocations = async () => {
      try {
        const res = await api.get('/api/locations');
        if (!mounted) return;
        setLocations(res.data || []);
      } catch (err: any) {
        console.error('Erro ao buscar localidades:', err?.message || err);
        setError('Não foi possível carregar as localizações.');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchLocations();
    return () => { mounted = false; };
  }, []);

  // Lazy-load react-native-maps only after mount on native platforms
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (isWeb) return;
      try {
        const mod = await import('react-native-maps');
        if (!mounted) return;
        const m: any = mod as any;
        setMapViewComp(m.default || m.MapView || m);
        setMarkerComp(m.Marker || m.MapMarker || null);
      } catch (e) {
        console.warn('react-native-maps not available', e);
      }
    };
    load();
    return () => { mounted = false; };
  }, [isWeb]);

  const markers = locations
    .map((l) => {
      const lat = l?.address?.lat;
      const long = l?.address?.long;
      const parsedLat = typeof lat === 'string' ? parseFloat(lat) : lat;
      const parsedLong = typeof long === 'string' ? parseFloat(long) : long;
      if (!parsedLat || !parsedLong || Number.isNaN(parsedLat) || Number.isNaN(parsedLong)) return null;
      return {
        id: l.id,
        title: l.name,
        coordinate: {
          latitude: parsedLat,
          longitude: parsedLong,
        },
      };
    })
    .filter(Boolean) as { id: string; title: string; coordinate: { latitude: number; longitude: number } }[];

  const initialRegion = markers.length > 0
    ? {
        latitude: markers[0].coordinate.latitude,
        longitude: markers[0].coordinate.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }
    : {
        latitude: -6.6007746,
        longitude: -39.0576952,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text>{error}</Text>
      </View>
    );
  }


  const goToCoordinate = async (latitude: number, longitude: number) => {
    if (!latitude || !longitude) return;
    if (isWeb) {
      setSelectedCoord({ latitude, longitude });
      return;
    }

    if (!isWeb && mapRef.current && typeof mapRef.current.animateToRegion === 'function') {
      try {
        mapRef.current.animateToRegion({ latitude, longitude, latitudeDelta: 0.01, longitudeDelta: 0.01 }, 500);
      } catch (e) {
        console.warn('Erro ao mover a câmera:', e);
      }
      return;
    }
    // Non-web fallback: attempt to open external maps URL
    const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
    try {
      await Linking.openURL(url);
    } catch (e) {
      console.warn('Não foi possível abrir o link de mapa', e);
    }
  };

  if (isWeb || !MapViewComp) {
    // Web: render embedded Google Maps iframe and clickable list to update it
    const iframeCenter = selectedCoord || (markers.length > 0 ? markers[0].coordinate : { latitude: initialRegion.latitude, longitude: initialRegion.longitude });
    const iframeSrc = `https://maps.google.com/maps?q=${iframeCenter.latitude},${iframeCenter.longitude}&z=15&output=embed`;

    return (
      <View style={[styles.container, { padding: 0 }]}> 
        <View style={styles.webMapContainer}>
          <iframe
            title="Mapa"
            src={iframeSrc}
            style={styles.iframe}
            loading="lazy"
          />
        </View>
        <View style={{ padding: 12 }}>
          <Text style={{ fontWeight: '600', marginBottom: 8 }}>Localizações</Text>
          {markers.length === 0 && <Text>Nenhuma localização com coordenadas disponível.</Text>}
          {markers.map((m) => (
            <View key={m.id} style={{ marginBottom: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <TouchableOpacity onPress={() => goToCoordinate(m.coordinate.latitude, m.coordinate.longitude)} style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, color: '#007aff' }}>{m.title}</Text>
                <Text style={{ color: '#666' }}>{m.coordinate.latitude}, {m.coordinate.longitude}</Text>
              </TouchableOpacity>
              <View style={{ marginLeft: 8 }}>
                <TouchableOpacity
                  onPress={async () => {
                    if (adding[m.id]) return;
                    // toggle favorite: if already added, do nothing (could implement remove later)
                    if (addedIds[m.id]) return;
                    setAdding((s) => ({ ...s, [m.id]: true }));
                    try {
                      await favoritesService.addFavorite(m.id);
                      setAddedIds((s) => ({ ...s, [m.id]: true }));
                    } catch (e) {
                      console.warn('Erro ao adicionar favorito', e);
                    } finally {
                      setAdding((s) => ({ ...s, [m.id]: false }));
                    }
                  }}
                  style={{ paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 }}
                >
                  {adding[m.id] ? (
                    <ActivityIndicator size="small" color="#e11d48" />
                  ) : (
                    <Feather name="heart" size={20} color={addedIds[m.id] ? '#e11d48' : '#999'} />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapViewComp
        style={styles.map}
        ref={mapRef}
        initialRegion={initialRegion}
      >
        {markers.map((m) => (
          <MarkerComp
            key={m.id}
            coordinate={m.coordinate}
            title={m.title}
          />
        ))}
      </MapViewComp>

      {/* Simple sticky list at bottom for quick navigation to markers (native) */}
      <View style={styles.bottomList} pointerEvents="box-none">
        {markers.map((m) => (
          <View key={`btn-${m.id}`} style={[styles.listItem, { flexDirection: 'row', alignItems: 'center' }]}> 
            <TouchableOpacity style={{ flex: 1 }} onPress={() => goToCoordinate(m.coordinate.latitude, m.coordinate.longitude)}>
              <Text style={styles.listText}>{m.title}</Text>
            </TouchableOpacity>
            <View style={{ marginLeft: 8 }}>
              {addedIds[m.id] ? (
                <Text style={{ color: '#22c55e', fontWeight: '600' }}>✓</Text>
              ) : (
                <TouchableOpacity
                  onPress={async () => {
                    if (adding[m.id]) return;
                    setAdding((s) => ({ ...s, [m.id]: true }));
                    try {
                      await favoritesService.addFavorite(m.id);
                      setAddedIds((s) => ({ ...s, [m.id]: true }));
                    } catch (e) {
                      console.warn('Erro ao adicionar favorito', e);
                    } finally {
                      setAdding((s) => ({ ...s, [m.id]: false }));
                    }
                  }}
                  style={{ paddingHorizontal: 8, paddingVertical: 6, backgroundColor: '#22c55e', borderRadius: 6 }}
                >
                  {adding[m.id] ? <ActivityIndicator size="small" color="#fff" /> : <Text style={{ color: '#fff' }}>+</Text>}
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomList: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 12,
    paddingHorizontal: 12,
    flexDirection: 'row',
    flexWrap: 'nowrap',
    gap: 8,
    justifyContent: 'flex-start'
  },
  listItem: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
    elevation: 2,
  },
  listText: {
    fontSize: 14,
    color: '#333',
  }
  ,
  webMapContainer: {
    width: '100%',
    height: 360,
    backgroundColor: '#eee'
  },
  iframe: {
    width: '100%',
    height: '100%',
    borderWidth: 0,
  }
});
