import {
  ReaderPage,
  ReaderPageManager,
  ReaderRenderConfig,
  ReaderConfig,
  ReaderSource,
} from '@components/Reader/types';

describe('reader page manager test', () => {
  it('reader page manager start', async () => {
    let source: ReaderSource = {
      async getPage(pageId) {
        if (pageId < 2) {
          return [
            '1234-1234-1234-1234-1234-1234-',
            '1234-1234-1234-1234-1234-1234-',
            '1234-1234-1234-1234-1234-1234-',
            '1234-1234-1234-1234-1234-1234-',
            '1234-1234-1234-1234-1234-1234-',
          ];
        } else {
          return undefined;
        }
      },
    };

    let renderConfig: ReaderRenderConfig = {
      height: 70,
      width: 375,
      lineHeight: 16,
      fontSize: 16,
    };

    let config: ReaderConfig = {
      buffer: 6,
    };

    let readerPageManager = new ReaderPageManager(source, config);

    readerPageManager.addLoadingPage(0);
    let data = await readerPageManager.fetchPage(0);
    if (data) {
      readerPageManager.addPage(0, data);
    } else {
      readerPageManager.addErrorPage(0);
    }

    data = await readerPageManager.fetchPage(1);
    if (data) {
      readerPageManager.addPage(1, data);
    } else {
      readerPageManager.addErrorPage(1);
    }

    data = await readerPageManager.fetchPage(2);
    if (data) {
      readerPageManager.addPage(2, data);
    } else {
      readerPageManager.addErrorPage(2);
    }

    let pages = readerPageManager.render(0, renderConfig, false);

    expect(pages.length).toEqual(7);
  });
});

describe('reader page test', () => {
  it('reader end', () => {
    let config: ReaderRenderConfig = {
      height: 800,
      width: 375,
      lineHeight: 16,
      fontSize: 16,
    };

    let reader = new ReaderPage(1);
    reader.setData(['1234-1234-1234-1234-1234-1234-']);

    let pages = reader.render(config);

    expect(pages.length).toEqual(1);

    let page = pages[0];

    expect(page.key).toStrictEqual('page_1_0');
    expect(page.data[0]).toStrictEqual('1234-1234-1234-1234-1234-1234-');
  });

  it('reader render', () => {
    let config: ReaderRenderConfig = {
      height: 70,
      width: 375,
      lineHeight: 16,
      fontSize: 16,
    };

    let reader = new ReaderPage(1);

    reader.setData([
      '1234-1234-1234-1234-1234-1234-',
      '1234-1234-1234-1234-1234-1234-',
      '1234-1234-1234-1234-1234-1234-',
      '1234-1234-1234-1234-1234-1234-',
      '1234-1234-1234-1234-1234-1234-',
    ]);

    let pages = reader.render(config);

    expect(pages.length).toEqual(3);
  });
});
