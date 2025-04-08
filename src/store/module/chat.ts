import {create} from 'zustand';
import {Store} from '../types';
import {openIMChatClient} from '@components/Chat/client';

export interface ChatState {
  connecting: boolean;
  setConnecting(connecting: boolean): void;
}

export const useChatStore = create<ChatState>()(set => ({
  connecting: false,
  setConnecting: connecting => set(state => ({...state, connecting})),
}));

export const chatStore: Store = {
  async ensureInitialization() {
    await openIMChatClient.ensureInitialization();
  },
};
