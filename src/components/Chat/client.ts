import * as RNFS from '@dr.pogodin/react-native-fs';
import OpenIMSDKRN, {OpenIMEmitter} from 'open-im-sdk-rn';
import {useLog} from '@tools/log';
import {unstable_batchedUpdates} from 'react-native';
import {useChatStore} from '@store/module/chat';
import { ChatClient } from './types';

const CHAT_DATA_DIR = RNFS.DocumentDirectoryPath + '/openim_data_dir';


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

export const openIMChatClient: ChatClient = {
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
