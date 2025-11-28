import AsyncStorage from '@react-native-async-storage/async-storage';

const QUEUE_KEY = 'offline_action_queue';

export type OfflineAction = {
  action: string;
  userId?: string | number;
  locationId?: string;
  meta?: any;
};

export const enqueue = async (item: OfflineAction) => {
  try {
    const raw = await AsyncStorage.getItem(QUEUE_KEY);
    const arr: OfflineAction[] = raw ? JSON.parse(raw) : [];
    arr.push(item);
    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(arr));
    return true;
  } catch (e) {
    console.warn('enqueue error', e);
    return false;
  }
};

export const getAll = async (): Promise<OfflineAction[]> => {
  try {
    const raw = await AsyncStorage.getItem(QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn('getAll queue error', e);
    return [];
  }
};

export const clear = async () => {
  try {
    await AsyncStorage.removeItem(QUEUE_KEY);
  } catch (e) {
    console.warn('clear queue error', e);
  }
};

export const removeByIndexes = async (indexes: number[]) => {
  try {
    const raw = await AsyncStorage.getItem(QUEUE_KEY);
    const arr: OfflineAction[] = raw ? JSON.parse(raw) : [];
    const filtered = arr.filter((_, i) => !indexes.includes(i));
    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.warn('removeByIndexes error', e);
  }
};