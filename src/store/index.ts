import { userStore } from './module/user';
import {Store} from './types';

const stores: Store[] = [userStore];

export async function ensureStoresInitialization() {
  for (const store of stores) {
    await store.ensureInitialization();
  }
}
