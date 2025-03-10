import React from 'react';
import {StyleProp, useWindowDimensions, ViewStyle} from 'react-native';
import {ReaderRenderConfig, ReaderPageManager, ReaderSource} from './types';

import PagerView from 'react-native-pager-view';
import {ReaderContext} from './context';
import {ReaderPageView} from './ReaderPage';

export type ReaderProps = {
  source: ReaderSource;
};

export function Reader(props: ReaderProps) {
  const {width, height} = useWindowDimensions();

  const [renderConfig] = React.useState<ReaderRenderConfig>({
    height: height,
    width: width,
    lineHeight: 16,
    fontSize: 16,
  });

  const [forceUpdate, setForceUpdate] = React.useState(false);

  const manager = React.useRef(
    new ReaderPageManager(props.source, {
      buffer: 10,
    }),
  );

  const [currentPage, setCurrentPage] = React.useState<number>(0);

  const pageViewStyle = React.useMemo<StyleProp<ViewStyle>>(() => {
    return {
      height: renderConfig.height,
      width: renderConfig.width,
    };
  }, [renderConfig]);

  const pages = React.useMemo(() => {
    return manager.current.render(currentPage, renderConfig, forceUpdate);
  }, [renderConfig, currentPage, forceUpdate]);

  const onPageSelected = React.useCallback(
    (pageIndex: number) => {
      let pageId = manager.current.getPageId(pageIndex);
      if (pageId !== currentPage) {
        setCurrentPage(pageId);
        manager.current.initialization(pageId);
      }
    },
    [currentPage],
  );

  const fetchPage = React.useCallback(async (pageId: number) => {
    try {
      manager.current.addLoadingPage(pageId);
      setForceUpdate(prev => !prev);

      const data = await manager.current.fetchPage(pageId);

      if (data) {
        manager.current.addPage(pageId, data);
        setForceUpdate(prev => !prev);
      }
    } catch (error) {
      manager.current.addErrorPage(pageId);
      setForceUpdate(prev => !prev);

      throw error;
    }
  }, []);

  React.useEffect(() => {
    async function initialization() {
      await manager.current.initialization(0);
      setForceUpdate(prev => !prev);
    }

    initialization();
  }, []);

  return (
    <ReaderContext.Provider
      value={{
        config: renderConfig,
        fetchPage,
      }}>
      <PagerView
        style={pageViewStyle}
        onPageSelected={e => {
          onPageSelected(e.nativeEvent.position);
        }}>
        {pages.map(page => {
          return <ReaderPageView {...page} key={page.key} />;
        })}
      </PagerView>
    </ReaderContext.Provider>
  );
}
