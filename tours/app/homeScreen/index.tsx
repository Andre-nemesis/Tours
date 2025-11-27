import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import api from '../../services/api';

type Props = {
  goToInicio?: () => void;
  goToMapas?: () => void;
  goToFavoritos?: () => void;
  goToConta?: () => void;
};

export default function HomeScreen(_props: Props) {
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>('');
  const [recent, setRecent] = useState<Array<any>>([]);
  const [suggestions, setSuggestions] = useState<Array<any>>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await api.get('/api/locations');
        if (!mounted) return;
        const data = res.data || [];
        setRecent(data.slice(0, 4));
        setSuggestions(data.slice(4, 10));
      } catch (err: any) {
        if (err.response && err.response.status === 401) {
          setErrorMsg('Faça login para ver localidades reais');
        } else {
          setErrorMsg('Não foi possível carregar localidades');
        }
      }
    };
    // get stored user name (if token exists)
    const loadUser = async () => {
      try {
        const { getStoredUser } = await import('../../services/auth');
        const u = await getStoredUser();
        if (mounted && u && u.name) setUserName(u.name);
      } catch (e) {
        // ignore
      }
    };
    load();
    loadUser();
    return () => { mounted = false; };
  }, []);

  const openMaps = () => {
    // navega para a aba Maps
    router.push('Maps');
  };

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
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.hello}>Olá, {userName || 'Visitante'}</Text>
        </View>

        <TouchableOpacity>
          <Ionicons name="scan-outline" size={22} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={20} color="#777" />
        <TextInput
          placeholder="Pesquise lugares..."
          placeholderTextColor="#888"
          style={styles.searchInput}
        />
      </View>

      {/* Section Title */}
      <Text style={styles.sectionTitle}>Início</Text>

      {/* Visited Recently */}
      <Text style={styles.subtitleSection}>Principais Pontos</Text>

      <View style={styles.cardList}>
        {errorMsg && (
          <Text style={{ color: '#a00', marginBottom: 8 }}>{errorMsg}</Text>
        )}
        {recent.length === 0 && !errorMsg && (
          <Text style={{ color: '#666' }}>Nenhuma visita recente.</Text>
        )}
        {recent.map((loc) => (
          <TouchableOpacity key={loc.id} style={styles.visitCard} onPress={openMaps}>
            <Image
              source={{ uri: getPhotoUri(loc.photo) }}
              style={styles.avatar}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.visitTitle}>{loc.name}</Text>
              <Text style={styles.visitSubtitle}>{loc.address?.city || loc.address?.state || ''}</Text>
              {/* photo shown above in Image; no need to render the URL */}
            </View>

            <Ionicons name="chevron-forward" size={22} color="#555" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Maybe you like */}
      <Text style={[styles.subtitleSection, { marginTop: 20 }]}>
        Talvez você goste
      </Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {suggestions.length === 0 && (
          <>
            <Image
              style={styles.suggestion}
              source={{ uri: 'https://images.unsplash.com/photo-1505761671935-60b3a7427bad' }}
            />
            <Image
              style={styles.suggestion}
              source={{ uri: 'https://images.unsplash.com/photo-1505761671935-60b3a7427bad' }}
            />
            <Image
              style={styles.suggestion}
              source={{ uri: 'https://images.unsplash.com/photo-1495273967996-d057c23c5d55' }}
            />
          </>
        )}
        {suggestions.map((s) => (
          <TouchableOpacity key={s.id} onPress={openMaps}>
            <Image style={styles.suggestion} source={{ uri: getPhotoUri(s.photo) }} />
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={{ height: 80 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F4F4",
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  hello: {
    fontSize: 18,
    fontWeight: "500",
  },

  searchBox: {
    backgroundColor: "#E9E9E9",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
  },

  searchInput: {
    marginLeft: 10,
    fontSize: 16,
    flex: 1,
  },

  sectionTitle: {
    fontSize: 26,
    fontWeight: "600",
    marginTop: 25,
  },

  subtitleSection: {
    fontSize: 16,
    marginTop: 18,
    marginBottom: 10,
    color: "#444",
  },

  cardList: {
    gap: 12,
  },

  visitCard: {
    backgroundColor: "#FFF",
    padding: 14,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  avatar: {
    width: 45,
    height: 45,
    borderRadius: 50,
  },

  visitTitle: {
    fontSize: 16,
    fontWeight: "500",
  },

  visitSubtitle: {
    fontSize: 13,
    color: "#777",
  },

  suggestion: {
    width: 140,
    height: 150,
    borderRadius: 14,
    marginRight: 14,
  },
  
});
