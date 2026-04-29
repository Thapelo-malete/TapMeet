import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

type StorageLike = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
};

const memory = new Map<string, string>();

export const supabaseStorage: StorageLike = {
  async getItem(key) {
    if (Platform.OS === 'web') return memory.get(key) ?? null;
    return await SecureStore.getItemAsync(key);
  },
  async setItem(key, value) {
    if (Platform.OS === 'web') {
      memory.set(key, value);
      return;
    }
    await SecureStore.setItemAsync(key, value);
  },
  async removeItem(key) {
    if (Platform.OS === 'web') {
      memory.delete(key);
      return;
    }
    await SecureStore.deleteItemAsync(key);
  },
};

