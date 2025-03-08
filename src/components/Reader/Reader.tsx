import React from 'react';
import {StyleProp, useWindowDimensions, ViewStyle} from 'react-native';
import {ReaderRenderConfig, ReaderPageManager} from './types';

import PagerView from 'react-native-pager-view';
import {ReaderContext} from './context';
import {ReaderPageView} from './ReaderPage';

export function Reader() {
  const {width, height} = useWindowDimensions();

  const [renderConfig] = React.useState<ReaderRenderConfig>({
    height: height,
    width: width,
    lineHeight: 16,
    fontSize: 16,
  });

  const [forceUpdate, setForceUpdate] = React.useState(false);

  const manager = React.useRef(
    new ReaderPageManager({
      buffer: 4,
    }),
  );

  const [currentPage] = React.useState<number>(0);

  const pageViewStyle = React.useMemo<StyleProp<ViewStyle>>(() => {
    return {
      height: renderConfig.height,
      width: renderConfig.width,
    };
  }, [renderConfig]);

  const pages = React.useMemo(() => {
    return manager.current.render(currentPage, renderConfig, forceUpdate);
  }, [renderConfig, currentPage, forceUpdate]);

  const addPage = React.useCallback((pageId: number, data: string[]) => {
    manager.current.addPage(pageId, data);
    setForceUpdate(prev => !prev);
  }, []);

  return (
    <ReaderContext.Provider
      value={{
        config: renderConfig,
        addPage,
      }}>
      <PagerView style={pageViewStyle}>
        {pages.map(page => {
          return <ReaderPageView {...page} key={page.key} />;
        })}
      </PagerView>
    </ReaderContext.Provider>
  );
}
