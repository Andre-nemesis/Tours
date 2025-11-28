import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  ActivityIndicator,
  Platform,
  Alert,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import api from '../../services/api';
import LocationDetailsModal from '../../components/LocationDetailsModal';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as Clipboard from 'expo-clipboard';
import jsQR from 'jsqr';

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

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [scannerVisible, setScannerVisible] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

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
    const loadUser = async () => {
      try {
        const { getStoredUser } = await import('../../services/auth');
        const u = await getStoredUser();
        if (mounted && u && u.name) setUserName(u.name);
      } catch (e) {
      }
    };
    load();
    loadUser();
    return () => { mounted = false; };
  }, []);

  const openMaps = () => {
    router.push('Maps');
  };

  const openDetails = (id: string) => {
    setSelectedId(id);
    setModalVisible(true);
  };

  const requestCameraPermission = async () => {
    try {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
      return status === 'granted';
    } catch (e) {
      setHasPermission(false);
      return false;
    }
  };

  const openScanner = async () => {
    const ok = await requestCameraPermission();
    setScanned(false);
    setScannerVisible(true);
  };

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);

    try {
      await Clipboard.setStringAsync(String(data));
    } catch {
      try {
        // fallback para browsers
        if (navigator?.clipboard?.writeText) {
          await navigator.clipboard.writeText(String(data));
        }
      } catch {
        // ignore
      }
    }

    // tenta extrair id (mesma lógica antiga)
    const urlIdMatch = data.match(/locations\/(?:#?\/?)*([0-9a-fA-F\-]{8,36})/i);
    const uuidMatch = data.match(/([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})/);
    const id = urlIdMatch ? urlIdMatch[1] : (uuidMatch ? uuidMatch[1] : null);

    // aviso rápido pro usuário
    Alert.alert('QR lido', 'Conteúdo copiado para área de transferência');

    if (id) {
      // abre modal de detalhes interno
      setSelectedId(id);
      setScannerVisible(false);
      setModalVisible(true);
      setScanned(false);
      return;
    }

    try {
      if (/^https?:\/\//i.test(data)) {
        await Linking.openURL(data);
        setScannerVisible(false);
        setScanned(false);
        return;
      }
    } catch (e) {
      // ignore
    }

    setTimeout(() => {
      setScannerVisible(false);
      setScanned(false);
    }, 800);
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

  function WebQRCodeScanner({ onDetected, onClose }: { onDetected: (data: string) => void; onClose: () => void; }) {
    const videoRef = React.useRef<HTMLVideoElement | null>(null);
    const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
    const [error, setError] = useState<string | null>(null);
    const streamRef = React.useRef<MediaStream | null>(null);

    useEffect(() => {
      let rafId = 0;
      let mounted = true;

      const start = async () => {
        if (!navigator?.mediaDevices?.getUserMedia) {
          setError('getUserMedia não disponível neste browser.');
          return;
        }
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            await videoRef.current.play();
          }

          const tick = () => {
            if (!mounted) return;
            try {
              const video = videoRef.current;
              const canvas = canvasRef.current;
              if (video && canvas) {
                const w = video.videoWidth;
                const h = video.videoHeight;
                if (w && h) {
                  canvas.width = w;
                  canvas.height = h;
                  const ctx = canvas.getContext('2d');
                  if (ctx) {
                    ctx.drawImage(video, 0, 0, w, h);
                    const img = ctx.getImageData(0, 0, w, h);
                    const code = jsQR(img.data, img.width, img.height);
                    if (code?.data) {
                      // detectado
                      onDetected(code.data);
                      return;
                    }
                  }
                }
              }
            } catch (e) {
              // ignore
            }
            rafId = requestAnimationFrame(tick);
          };
          rafId = requestAnimationFrame(tick);
        } catch (err: any) {
          setError('Permissão negada ou câmera indisponível.');
        }
      };

      start();
      return () => {
        mounted = false;
        if (rafId) cancelAnimationFrame(rafId);
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(t => t.stop());
          streamRef.current = null;
        }
      };
    }, [onDetected]);

    return (
      <View style={styles.webScannerContainer as any}>
        <video ref={videoRef as any} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <canvas ref={canvasRef as any} style={{ display: 'none' }} />
        {error ? (
          <View style={styles.webPermission as any}>
            <Text style={{ color: '#fff', textAlign: 'center' }}>{error}</Text>
            <TouchableOpacity onPress={onClose} style={{ marginTop: 12 }}>
              <Text style={{ color: '#fff' }}>Fechar</Text>
            </TouchableOpacity>
          </View>
        ) : null}
        <TouchableOpacity onPress={onClose} style={styles.webClose as any}>
          <Ionicons name="close" size={30} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.hello}>Olá, {userName || 'Visitante'}</Text>
        </View>

        <TouchableOpacity onPress={openScanner}>
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
          <TouchableOpacity key={loc.id} style={styles.visitCard} onPress={() => openDetails(loc.id)}>
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

      <View style={{ height: 80 }} />
      <LocationDetailsModal visible={modalVisible} locationId={selectedId || undefined} onClose={() => setModalVisible(false)} />

      {Platform.OS === 'web' ? (
        scannerVisible && (
          <WebQRCodeScanner
            onDetected={async (data) => {
              try {
                await Clipboard.setStringAsync(String(data));
              } catch { /* fallback ignore */ }

              Alert.alert('QR lido', 'Conteúdo copiado para área de transferência');

              const urlIdMatch = String(data).match(/locations\/(?:#?\/?)*([0-9a-fA-F\-]{8,36})/i);
              const uuidMatch = String(data).match(/([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})/);
              const id = urlIdMatch ? urlIdMatch[1] : (uuidMatch ? uuidMatch[1] : null);

              if (id) {
                setSelectedId(id);
                setScannerVisible(false);
                setModalVisible(true);
                return;
              }

              if (/^https?:\/\//i.test(String(data))) {
                try { await Linking.openURL(String(data)); } catch {}
                setScannerVisible(false);
                return;
              }

              setScannerVisible(false);
            }}
            onClose={() => setScannerVisible(false)}
          />
        )
      ) : (
        <Modal visible={scannerVisible} transparent animationType="slide" onRequestClose={() => setScannerVisible(false)}>
          <View style={{ flex: 1, backgroundColor: '#000' }}>
            {hasPermission === null && (
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator size="large" color="#fff" />
                <Text style={{ color: '#fff', marginTop: 12 }}>Solicitando permissão de câmera...</Text>
              </View>
            )}
            {hasPermission === false && (
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 }}>
                <Text style={{ color: '#fff', textAlign: 'center' }}>
                  Não foi possível acessar a câmera. Habilite nas configurações do dispositivo.
                </Text>
                <TouchableOpacity onPress={() => setScannerVisible(false)} style={{ marginTop: 12 }}>
                  <Text style={{ color: '#fff' }}>Fechar</Text>
                </TouchableOpacity>
              </View>
            )}
            {hasPermission === true && (
              <BarCodeScanner
                onBarCodeScanned={handleBarCodeScanned}
                style={{ flex: 1 }}
              />
            )}
            <TouchableOpacity onPress={() => setScannerVisible(false)} style={{ position: 'absolute', top: 40, right: 16 }}>
              <Ionicons name="close" size={30} color="#fff" />
            </TouchableOpacity>
          </View>
        </Modal>
      )}
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

  webScannerContainer: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },

  webPermission: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },

  webScanner: {
    width: '100%',
    height: '100%',
  },

  webClose: {
    position: 'absolute',
    top: 40,
    right: 16,
  },
});
