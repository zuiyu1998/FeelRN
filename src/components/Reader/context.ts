import React, {useContext} from 'react';
import {ReaderRenderConfig} from './types';
import {StyleProp, TextStyle} from 'react-native';

export type ReaderContextState = {
  fetchPage(pageId: number, data: string[]): void;
  config: ReaderRenderConfig;
};

export const ReaderContext = React.createContext<
  ReaderContextState | undefined
>(undefined);

export function useReaderTextStyle() {
  const context = useContext(ReaderContext) as ReaderContextState;

  const textStyle = React.useMemo<StyleProp<TextStyle>>(() => {
    return {
      lineHeight: context.config.lineHeight,
      fontSize: context.config.fontSize,
    };
  }, [context.config]);

  return textStyle;
}
