import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, TextInput, ActivityIndicator } from 'react-native';
import api from '../../../services/api';
import favoritesService from '../../../services/favorites';
import ConfirmModal from '../../../components/ConfirmModal';
import { on, emit } from '../../../services/eventBus';
import { useRouter } from 'expo-router';
import { clearToken } from '../../../services/auth';

export default function Conta() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [editVisible, setEditVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfile();
    const unsub = on('profileChanged', loadProfile);
    return () => { unsub(); };
  }, []);

  async function loadProfile() {
    setLoading(true);
    let mounted = true;
    let userInfo = {id:''};
    try {
      const loadUser = async () => {
        try {
          const { getStoredUser } = await import('../../../services/auth');
          const u = await getStoredUser();
          if (mounted && u && u.id) userInfo.id = u.id;
        } catch (e) {
          // ignore
        }
      };
      await loadUser();
      const res = await api.get(`api/users/${userInfo?.id || ''}`);
      const u = res?.data || null;
      setUser(u);
      setForm({ name: u?.name || '', email: u?.email || '', password: '' });

      // contar favoritos via service
      try {
        const favs = await favoritesService.getFavorites();
        setFavoritesCount(Array.isArray(favs) ? favs.length : 0);
      } catch {
        setFavoritesCount(0);
      }
    } catch (e) {
      console.warn('Erro ao carregar perfil', e);
      setUser(null);
      setFavoritesCount(0);
    } finally {
      setLoading(false);
    }
  }

  const initialLetter = (user?.name ? String(user.name).trim().charAt(0).toUpperCase() : '?');

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const payload: any = {};
      if (form.name) payload.name = form.name;
      if (form.email) payload.email = form.email;
      if (form.password) payload.password = form.password;
      await api.put(`api/users/${user.id}`, payload);
      emit('profileChanged');
      setEditVisible(false);
    } catch (e) {
      console.warn('Erro ao salvar perfil', e);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!user) return;
    setConfirmVisible(false);
    try {
      await api.delete(`api/users/${user.id}`);
      await clearToken();
      router.replace('/');
    } catch (e) {
      console.warn('Erro ao excluir conta', e);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#22c55e" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* USER PROFILE */}
      <View style={styles.profileContainer}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarInitial}>{initialLetter}</Text>
        </View>

        <Text style={styles.userName}>{user?.name || 'Usuário'}</Text>
        <Text style={styles.userEmail}>{user?.email || ''}</Text>
      </View>

      {/* ACTION BUTTONS */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={() => setEditVisible(true)}>
          <Text style={styles.actionButtonText}>Editar conta</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={() => setConfirmVisible(true)}>
          <Text style={styles.actionButtonText}>Excluir conta</Text>
        </TouchableOpacity>
      </View>

      {/* STATS */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{user?.visitedCount ?? 0}</Text>
          <Text style={styles.statLabel}>Lugares visitados</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{favoritesCount}</Text>
          <Text style={styles.statLabel}>Favoritos</Text>
        </View>
      </View>

      {/* Edit Modal */}
      <Modal visible={editVisible} animationType="slide" transparent>
        <View style={modalStyles.backdrop}>
          <View style={modalStyles.modal}>
            <Text style={modalStyles.title}>Editar conta</Text>
            <TextInput
              style={modalStyles.input}
              placeholder="Nome"
              value={form.name}
              onChangeText={(t) => setForm((s) => ({ ...s, name: t }))}
            />
            <TextInput
              style={modalStyles.input}
              placeholder="Email"
              value={form.email}
              onChangeText={(t) => setForm((s) => ({ ...s, email: t }))}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={modalStyles.input}
              placeholder="Senha (deixe em branco para manter)"
              value={form.password}
              onChangeText={(t) => setForm((s) => ({ ...s, password: t }))}
              secureTextEntry
            />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
              <TouchableOpacity onPress={() => setEditVisible(false)} style={[modalStyles.btn, { backgroundColor: '#eee' }]}>
                <Text>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSave} style={[modalStyles.btn, { backgroundColor: '#22c55e' }]}>
                {saving ? <ActivityIndicator color="#fff" /> : <Text style={{ color: '#fff' }}>Salvar</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <ConfirmModal
        visible={confirmVisible}
        title="Excluir conta"
        message="Tem certeza que deseja excluir sua conta? Essa ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        onCancel={() => setConfirmVisible(false)}
        onConfirm={handleDelete}
      />
    </View>
  );
}

const modalStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: '#fff',
    width: '100%',
    maxWidth: 420,
    borderRadius: 12,
    padding: 16,
  },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  input: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  btn: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
});

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
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    backgroundColor: '#C4FDD4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    fontSize: 36,
    fontWeight: '700',
    color: '#166534',
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
});
