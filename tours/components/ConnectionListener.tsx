import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import * as Notifications from 'expo-notifications';
import { flushQueue } from '../services/syncService';

export default function ConnectionListener() {
  const [offlineVisible, setOfflineVisible] = useState(false);
  const [onlineVisible, setOnlineVisible] = useState(false);
  const prevConnected = useRef<boolean | null>(null);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        await Notifications.requestPermissionsAsync();
      }
    })();

    const unsubscribe = NetInfo.addEventListener(async (state) => {
      const connected = !!state.isConnected && (state.isInternetReachable ?? true);

      if (prevConnected.current === null) {
        prevConnected.current = connected;
        return;
      }

      if (!connected && prevConnected.current) {
        prevConnected.current = false;
        setOfflineVisible(true);
        if (Platform.OS !== 'web') {
          Notifications.scheduleNotificationAsync({
            content: { title: 'Sem conexão', body: 'Seu dispositivo ficou sem internet.' },
            trigger: null,
          });
        }
      }

      if (connected && !prevConnected.current) {
        prevConnected.current = true;
        setOnlineVisible(true);
        if (Platform.OS !== 'web') {
          Notifications.scheduleNotificationAsync({
            content: { title: 'Conexão restaurada', body: 'A conexão com a internet foi restabelecida.' },
            trigger: null,
          });
        }

        try {
          await flushQueue();
        } catch (e) {
          console.warn('flushQueue on reconnect failed', e);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      <Modal visible={offlineVisible} transparent animationType="fade" onRequestClose={() => setOfflineVisible(false)}>
        <View style={styles.backdrop}>
          <View style={styles.modal}>
            <Text style={styles.title}>Sem internet</Text>
            <Text style={styles.message}>Sua conexão com a internet foi perdida.</Text>
            <TouchableOpacity style={styles.btn} onPress={() => setOfflineVisible(false)}>
              <Text style={styles.btnText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={onlineVisible} transparent animationType="fade" onRequestClose={() => setOnlineVisible(false)}>
        <View style={styles.backdrop}>
          <View style={styles.modal}>
            <Text style={styles.title}>Conectado</Text>
            <Text style={styles.message}>A conexão com a internet foi restabelecida.</Text>
            <TouchableOpacity style={styles.btn} onPress={() => setOnlineVisible(false)}>
              <Text style={styles.btnText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modal: { width: '100%', maxWidth: 420, backgroundColor: '#fff', borderRadius: 12, padding: 18, alignItems: 'center' },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  message: { fontSize: 14, color: '#444', textAlign: 'center', marginBottom: 14 },
  btn: { backgroundColor: '#00C18A', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 8 },
  btnText: { color: '#fff', fontWeight: '600' },
});