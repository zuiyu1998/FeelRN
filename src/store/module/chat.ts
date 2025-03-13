import * as RNFS from '@dr.pogodin/react-native-fs';
import OpenIMSDKRN, {OpenIMEmitter} from 'open-im-sdk-rn';

import {create} from 'zustand';
import {Store} from '../types';
import {useLog} from '@tools/log';
import {unstable_batchedUpdates} from 'react-native';

const CHAT_DATA_DIR = RNFS.DocumentDirectoryPath + '/openim_data_dir';

export interface ChatClient {
  ensureInitialization(): Promise<void>;
}

type WsResponse<T = unknown> = {
  errCode: number;
  errMsg: string;
  data: T;
  operationID: string;
};

OpenIMEmitter.addListener('onConnecting', () => {
  const log = useLog('chatClient');
  log.info('onConnecting');
  updateChatStateConnecting(true);
});

OpenIMEmitter.addListener('onConnectSuccess', () => {
  const log = useLog('chatClient');
  log.info('onConnecting');
  updateChatStateConnecting(false);
});

OpenIMEmitter.addListener(
  'onConnectFailed',
  ({errCode, errMsg}: WsResponse<any>) => {
    const log = useLog('chatClient');
    log.info('onConnectFailed', errCode, errMsg);
    updateChatStateConnecting(false);
  },
);

const chatClient: ChatClient = {
  async ensureInitialization() {
    await RNFS.mkdir(CHAT_DATA_DIR);
    await OpenIMSDKRN.initSDK(
      {
        apiAddr: 'http://192.168.0.230:10002',
        wsAddr: 'ws://192.168.0.230:10001',
        dataDir: CHAT_DATA_DIR,
        logLevel: 5,
        isLogStandardOutput: true,
      },
      'opid',
    );
  },
};

const updateChatStateConnecting = (connecting: boolean) => {
  unstable_batchedUpdates(() => {
    useChatStore.getState().setConnecting(connecting);
  });
};

export interface ChatState {
  connecting: boolean;
  ensureInitialization(): Promise<void>;
  setConnecting(connecting: boolean): void;
}

export const useChatStore = create<ChatState>()(set => ({
  connecting: false,
  async ensureInitialization() {
    await chatClient.ensureInitialization();
  },
  setConnecting: connecting => set(state => ({...state, connecting})),
}));

export const chatStore: Store = {
  async ensureInitialization() {},
};
