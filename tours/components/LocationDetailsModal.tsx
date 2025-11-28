import React, { useEffect, useState } from 'react';
import { Modal, View, Text, StyleSheet, Image, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';
import { Video } from 'expo-av';

type Props = {
  visible: boolean;
  locationId?: string | null;
  onClose: () => void;
};

export default function LocationDetailsModal({ visible, locationId, onClose }: Props) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const selectedVideoRef = React.useRef<any>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!visible || !locationId) return;
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/api/locations-with-details/${locationId}`);
        if (!mounted) return;
        setData(res.data || null);
      } catch (e: any) {
        if (!mounted) return;
        setError('Não foi possível carregar os detalhes.');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [visible, locationId]);

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
    <>
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={{ padding: 8 }}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          {loading && (
            <View style={styles.center}><ActivityIndicator size="large" /></View>
          )}

          {!loading && error && (
            <View style={styles.center}><Text>{error}</Text></View>
          )}

          {!loading && data && (
            <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
              <Image source={{ uri: getPhotoUri(data.photo) }} style={styles.image} />
              <View style={styles.body}>
                <Text style={styles.title}>{data.name}</Text>
                <Text style={styles.subtitle}>{
                  (() => {
                    const a = data.address;
                    if (!a) return '';
                    if (typeof a === 'string') return a;
                    if (typeof a === 'object') return a.formatted || a.street || (a.city ? `${a.city}${a.state ? ', ' + a.state : ''}` : '') || '';
                    return '';
                  })()
                }</Text>

                {data.attractions && data.attractions.length > 0 && (
                  <View style={{ marginTop: 12 }}>
                    <Text style={{ fontWeight: '600', marginBottom: 6 }}>Atrações:</Text>
                    {data.attractions.map((a: any) => (
                      <View key={a.id} style={{ marginBottom: 8 }}>
                        <Text style={{ color: '#333', lineHeight: 20 }}>{`\u2022 ${a.name}${a.description ? ' — ' + a.description : ''}`}</Text>
                      </View>
                    ))}
                  </View>
                )}
                {data.views && data.views.length > 0 && (
                  <View style={{ marginTop: 12 }}>
                    <Text style={{ fontWeight: '600', marginBottom: 6 }}>Imagens</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 6 }}>
                      {data.views.filter((v: any) => {
                        const ct = (v.contentType || '').toLowerCase();
                        const knownImageExt = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'];
                        const knownVideoExt = ['.mp4', '.mov', '.webm', '.mkv'];
                        const contentStr = String(v.content || '');
                        const isImage = ct.includes('image') || knownImageExt.includes(ct) || contentStr.startsWith('data:') || contentStr.startsWith('http');
                        return isImage || ct.includes('video') || knownVideoExt.includes(ct);
                      }).map((v: any) => {
                        const ct = (v.contentType || '').toLowerCase();
                        const knownVideoExt = ['.mp4', '.mov', '.webm', '.mkv'];
                        const contentUri = getPhotoUri(v.content);
                        const isVideo = ct.includes('video') || knownVideoExt.includes(ct) || String(v.filename || '').match(/\.(mp4|mov|webm|mkv)$/i);
                        if (isVideo) {
                          return (
                            <TouchableOpacity key={v.id} style={{ marginRight: 8 }} activeOpacity={0.9} onPress={() => setSelectedVideo(contentUri)}>
                              <View style={{ width: 160, height: 90, borderRadius: 8, overflow: 'hidden', backgroundColor: '#000' }}>
                                <Video
                                  source={{ uri: contentUri }}
                                  style={{ width: '100%', height: '100%' }}
                                  useNativeControls={false}
                                  resizeMode={'cover' as any}
                                  isLooping
                                  shouldPlay={false}
                                />
                                <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
                                  <Ionicons name="play-circle" size={36} color="rgba(255,255,255,0.9)" />
                                </View>
                              </View>
                            </TouchableOpacity>
                          );
                        }

                        return (
                          <TouchableOpacity key={v.id} style={{ marginRight: 8 }} activeOpacity={0.8} onPress={() => setSelectedImage(contentUri)}>
                            <Image
                              source={{ uri: contentUri }}
                              style={{ width: 120, height: 80, borderRadius: 8, backgroundColor: '#eee' }}
                            />
                          </TouchableOpacity>
                        );
                      })}
                    </ScrollView>
                  </View>
                )}
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
    <Modal visible={!!selectedVideo} transparent animationType="fade" onRequestClose={() => { if (selectedVideoRef.current && selectedVideoRef.current.pauseAsync) selectedVideoRef.current.pauseAsync(); setSelectedVideo(null); }}>
      <View style={styles.fullScreenContainer}>
        <TouchableOpacity style={styles.fullScreenClose} onPress={() => { if (selectedVideoRef.current && selectedVideoRef.current.pauseAsync) selectedVideoRef.current.pauseAsync(); setSelectedVideo(null); }}>
          <Ionicons name="close" size={30} color="#fff" />
        </TouchableOpacity>
        {selectedVideo ? (
          <Video
            ref={selectedVideoRef}
            source={{ uri: selectedVideo }}
            style={styles.fullScreenImage}
            useNativeControls
            resizeMode={'contain' as any}
            shouldPlay
          />
        ) : null}
      </View>
    </Modal>

    <Modal visible={!!selectedImage} transparent animationType="fade" onRequestClose={() => setSelectedImage(null)}>
      <View style={styles.fullScreenContainer}>
        <TouchableOpacity style={styles.fullScreenClose} onPress={() => setSelectedImage(null)}>
          <Ionicons name="close" size={30} color="#fff" />
        </TouchableOpacity>
        {selectedImage ? (
          <Image source={{ uri: selectedImage }} style={styles.fullScreenImage} resizeMode="contain" />
        ) : null}
      </View>
    </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
  },
  container: {
    height: '80%',
    marginHorizontal: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 8,
  },
  image: {
    width: '100%',
    height: 180,
    backgroundColor: '#eee',
  },
  body: {
    padding: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  subtitle: {
    color: '#666',
    marginTop: 6,
  },
  fullScreenContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  fullScreenImage: {
    width: '100%',
    height: '100%',
  },
  fullScreenClose: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  }
});
