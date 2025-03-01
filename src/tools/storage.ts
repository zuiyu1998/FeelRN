import {MMKV} from 'react-native-mmkv';
import {StateStorage} from 'zustand/middleware';

class MMKVStorage implements IStorage {
  instance: MMKV;

  constructor(instance: MMKV) {
    this.instance = instance;
  }

  async getItem(name: string): Promise<string | null> {
    let value = this.instance.getString(name);
    if (value) {
      return value;
    } else {
      return null;
    }
  }

  async setItem(name: string, value: string): Promise<void> {
    this.instance.set(name, value);
  }

  async removeItem(name: string): Promise<string | null> {
    let v = await this.getItem(name);

    if (v) {
      this.instance.delete(name);
      return v;
    } else {
      return null;
    }
  }
}

interface IStorage {
  getItem: (name: string) => Promise<string | null>;
  setItem: (name: string, value: string) => Promise<void>;
  removeItem: (name: string) => Promise<string | null>;
}

class IStateStorage<T extends IStorage> implements StateStorage {
  storage: T;

  constructor(storage: T) {
    this.storage = storage;
  }

  getItem(name: string) {
    return this.storage.getItem(name);
  }
  setItem(name: string, value: string) {
    return this.storage.setItem(name, value);
  }
  removeItem(name: string) {
    return this.storage.removeItem(name);
  }
}

const storage: StateStorage = new IStateStorage(new MMKVStorage(new MMKV()));

export function getSingleStorage(): StateStorage {
  return storage;
}
