import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

export type OfflineAction = {
  action: string; 
  [key: string]: any; 
};

const STORAGE_KEY = 'offline_actions_queue_v1';

const AsyncDataPersistence = {
  enqueue: async (item: OfflineAction) => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const list: OfflineAction[] = raw ? JSON.parse(raw) : [];
      list.push(item);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      return true;
    } catch (err) {
      console.error('AsyncDataPersistence.enqueue error', err);
      return false;
    }
  },

  getAll: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      console.error('AsyncDataPersistence.getAll error', err);
      return [];
    }
  },

  clearAll: async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (err) {
      console.error('AsyncDataPersistence.clearAll error', err);
      return false;
    }
  },

  removeAtIndexes: async (indexes: number[]) => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const list: OfflineAction[] = raw ? JSON.parse(raw) : [];
      const filtered = list.filter((_, i) => indexes.indexOf(i) === -1);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      return true;
    } catch (err) {
      console.error('AsyncDataPersistence.removeAtIndexes error', err);
      return false;
    }
  },

  syncWithServer: async () => {
    try {
      const actions = await AsyncDataPersistence.getAll();
      if (!actions.length) return { ok: true, results: [] };

      const response = await api.post('/api/sync-offline', actions);
      const results = response?.data?.results || [];

      const successfulIndexes: number[] = [];
      results.forEach((r: any) => {
        if (!r.error) successfulIndexes.push(r.index);
      });

      if (successfulIndexes.length > 0) {
        await AsyncDataPersistence.removeAtIndexes(successfulIndexes);
      }

      return { ok: true, results };
    } catch (err) {
      console.error('AsyncDataPersistence.syncWithServer error', err);
      return { ok: false, error: err };
    }
  }
};

export default AsyncDataPersistence;
