import api from './api';
import { getStoredUser } from './auth';
import { emit } from './eventBus';

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
  try { emit('favoritesChanged', { action: 'add', locationId }); } catch (e) { /* ignore */ }
  return res.data;
}

export async function removeFavorite(locationId: string) {
  const user = await getStoredUser();
  if (!user || !user.id) throw new Error('Usuário não autenticado');
  const res = await api.delete('/api/favorites', { data: { userId: user.id, locationId } });
  try { emit('favoritesChanged', { action: 'remove', locationId }); } catch (e) { /* ignore */ }
  return res.data;
}

export default {
  getFavorites,
  addFavorite,
  removeFavorite,
};
