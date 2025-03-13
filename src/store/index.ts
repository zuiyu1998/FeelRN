import {chatStore} from './module/chat';
import {themeStore} from './module/theme';
import {userStore} from './module/user';
import {Store} from './types';

const stores: Store[] = [userStore, themeStore, chatStore];

export async function ensureStoresInitialization() {
  for (const store of stores) {
    await store.ensureInitialization();
  }
}
