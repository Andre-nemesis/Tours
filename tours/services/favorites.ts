import api from './api';
import { getStoredUser } from './auth';
import { emit } from './eventBus';
import { enqueue } from './offlineQueue';

export async function getFavorites() {
  const user = await getStoredUser();
  if (!user || !user.id) throw new Error('Usuário não autenticado');
  const res = await api.get(`/api/favorites/${user.id}`);
  return res.data;
}

export async function addFavorite(locationId: string) {
  const user = await getStoredUser();
  if (!user || !user.id) throw new Error('Usuário não autenticado');
  const res = await api.post('/api/favorites', { userId: user.id, locationId });
  try {
    emit('favoritesChanged', { action: 'add', locationId });
  } catch (e: any) {
    const isNetworkError = !e.response;
    if (isNetworkError) {
      await enqueue({ action: 'add_favorite', userId: user.id, locationId });
      emit('favoritesChanged');
      console.log('filaI')
      return { queued: true };
    }
    throw e;
  }
  return res.data;
}

export async function removeFavorite(locationId: string) {
  const user = await getStoredUser();
  if (!user || !user.id) throw new Error('Usuário não autenticado');
  const res = await api.delete('/api/favorites', { data: { userId: user.id, locationId } });
  try {
    emit('favoritesChanged', { action: 'remove', locationId });
  } catch (e: any) {
    console.log(e);
    const isNetworkError = !e.response;
    if (isNetworkError) {
      await enqueue({ action: 'remove_favorite', userId: user.id, locationId });
      emit('favoritesChanged');
      return { queued: true };
    }
    return res.data;
  }
  return res.data;
}

export default {
  getFavorites,
  addFavorite,
  removeFavorite,
};
