import { useEffect, useState, useCallback } from 'react';
import AsyncDataPersistence, { OfflineAction } from '../services/AsyncDataPersistence';

type UseSyncOfflineResult = {
  enqueueAddFavorite: (userId: string, locationId: string) => Promise<boolean>;
  enqueueRemoveFavorite: (userId: string, locationId: string) => Promise<boolean>;
  syncNow: () => Promise<{ ok: boolean; results?: any[]; error?: any }>;
  getQueue: () => Promise<OfflineAction[]>;
  clearQueue: () => Promise<boolean>;
  isSyncing: boolean;
  isConnected: boolean | null; // null => unknown (caso nao estiver com NetInfo)
};

export default function useSyncOffline(): UseSyncOfflineResult {
  const [isSyncing, setIsSyncing] = useState(false);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  const syncNow = useCallback(async () => {
    setIsSyncing(true);
    try {
      const result = await AsyncDataPersistence.syncWithServer();
      setIsSyncing(false);
      return result;
    } catch (err) {
      setIsSyncing(false);
      return { ok: false, error: err };
    }
  }, []);

  // tenta rodar o netinfo, caso nao instalar, deixa como '' isConnected=null ''
  useEffect(() => {
    let unsub: (() => void) | null = null;
    let mounted = true;

    const tryNetInfo = async () => {
      try {
        const NetInfoModule = await import('@react-native-community/netinfo');
        const NetInfo = NetInfoModule.default || NetInfoModule;
        if (!NetInfo || !NetInfo.addEventListener) return;

        const subscription = NetInfo.addEventListener((state: any) => {
          if (!mounted) return;
          const connected = !!state.isConnected;
          setIsConnected(connected);
          if (connected) {
            syncNow();
          }
        });

        unsub = () => {
          try {
            if (typeof subscription === 'function') subscription();
          } catch (e) {
            // ignore
          }
        };
      } catch (err) {
    
        setIsConnected(null);
      }
    };

    tryNetInfo();

    return () => {
      mounted = false;
      if (unsub) unsub();
    };
  }, [syncNow]);

  const enqueueAddFavorite = useCallback(async (userId: string, locationId: string) => {
    const action: OfflineAction = { action: 'add_favorite', userId, locationId };
    const ok = await AsyncDataPersistence.enqueue(action);
    if (ok && isConnected) {
      syncNow();
    }
    return ok;
  }, [isConnected, syncNow]);

  const enqueueRemoveFavorite = useCallback(async (userId: string, locationId: string) => {
    const action: OfflineAction = { action: 'remove_favorite', userId, locationId };
    const ok = await AsyncDataPersistence.enqueue(action);
    if (ok && isConnected) {
      syncNow();
    }
    return ok;
  }, [isConnected, syncNow]);

  const getQueue = useCallback(async () => {
    return AsyncDataPersistence.getAll();
  }, []);

  const clearQueue = useCallback(async () => {
    return AsyncDataPersistence.clearAll();
  }, []);

  return {
    enqueueAddFavorite,
    enqueueRemoveFavorite,
    syncNow,
    getQueue,
    clearQueue,
    isSyncing,
    isConnected
  };
}
