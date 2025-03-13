import {logger, consoleTransport, fileAsyncTransport} from 'react-native-logs';
import * as RNFS from '@dr.pogodin/react-native-fs';

const appFS: any = {
  DocumentDirectoryPath: RNFS.DocumentDirectoryPath,
  appendFile: RNFS.appendFile,
};

const LOG = logger.createLogger({
  transport: __DEV__ ? consoleTransport : fileAsyncTransport,
  severity: __DEV__ ? 'debug' : 'error',
  transportOptions: {
    FS: appFS,
  },
});

export function useLog(namespace: string) {
  return LOG.extend(namespace);
}

export {LOG};
