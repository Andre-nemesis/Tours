import api from './api';
import * as offlineQueue from './offlineQueue';

const SYNC_ENDPOINT = '/api/sync-offline'; 

export const flushQueue = async () => {
  const actions = await offlineQueue.getAll();
  if (!actions || actions.length === 0) return { ok: true, processed: 0 };

  try {
    const res = await api.post(SYNC_ENDPOINT, actions, { timeout: 30000 });
    const results = res.data?.results;
    if (!Array.isArray(results)) {
      return { ok: false, message: 'Unexpected sync response' };
    }

    const successIndexes: number[] = [];
    results.forEach((r: any) => {
      if (r.ok || r.created || r.detail?.deleted || r.detail?.created) successIndexes.push(r.index);
    });

    if (successIndexes.length > 0) {
      await offlineQueue.removeByIndexes(successIndexes);
    }

    return { ok: true, processed: successIndexes.length, total: actions.length, details: results };
  } catch (err: any) {
    console.warn('sync flush error', err?.message || err);
    return { ok: false, message: err?.message || 'Network error' };
  }
};