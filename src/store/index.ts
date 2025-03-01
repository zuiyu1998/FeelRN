import {Store} from './types';

const stores: Store[] = [];

export async function ensureStoresInitialization() {
  for (const store of stores) {
    await store.ensureInitialization();
  }
}
