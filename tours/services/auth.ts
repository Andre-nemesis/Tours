import AsyncStorage from '@react-native-async-storage/async-storage';
import api, { setAuthToken } from './api';

const TOKEN_KEY = 'auth_token';

export async function saveToken(token: string) {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
    setAuthToken(token);
  } catch (e) {
    console.warn('Erro ao salvar token', e);
  }
}

export async function clearToken() {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } catch (e) {
    console.warn('Erro ao remover token', e);
  }
  setAuthToken(null);
}

export async function loadToken() {
  try {
    const t = await AsyncStorage.getItem(TOKEN_KEY);
    if (t) setAuthToken(t);
    return t;
  } catch (e) {
    console.warn('Erro ao carregar token', e);
    return null;
  }
}

function base64UrlDecode(str: string) {
  try {
    const b64 = str.replace(/-/g, '+').replace(/_/g, '/');
    if (typeof atob === 'function') {
      return decodeURIComponent(Array.prototype.map.call(atob(b64), (c: string) => '%'+('00'+c.charCodeAt(0).toString(16)).slice(-2)).join(''));
    }
    // fallback for environments without atob (Node)
    try {
      // @ts-ignore
      const buf = Buffer.from(b64, 'base64');
      return buf.toString('utf8');
    } catch (e) {
      return '';
    }
  } catch (e) {
    return '';
  }
}

export function parseJwt(token?: string | null) {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length < 2) return null;
  const payload = parts[1];
  try {
    const json = base64UrlDecode(payload);
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
}

export async function getStoredUser() {
  try {
    const t = await loadToken();
    if (!t) return null;
    return parseJwt(t);
  } catch (e) {
    return null;
  }
}

export async function loginRequest(email: string, password: string) {
  return api.post('/api/login', { email, password });
}

export async function registerRequest(name: string, email: string, password: string) {
  try {
    const response = await api.post('/api/users', {
      name,
      email,
      password,
    });
    return response.data;
  } catch (error: any) {
    console.log('Erro completo:', error.response?.data || error.message);
    throw error;
  }
}