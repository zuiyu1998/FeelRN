import {
  ReaderPage,
  ReaderPageManager,
  ReaderRenderConfig,
  ReaderConfig,
} from '@components/Reader/types';

describe('reader page manager test', () => {
  it('reader page manager start', () => {
    let renderConfig: ReaderRenderConfig = {
      height: 70,
      width: 375,
      lineHeight: 16,
      fontSize: 16,
    };

    let config: ReaderConfig = {
      buffer: 4,
    };

    let readerPageManager = new ReaderPageManager(config);

    readerPageManager.addPage(0, [
      '1234-1234-1234-1234-1234-1234-',
      '1234-1234-1234-1234-1234-1234-',
      '1234-1234-1234-1234-1234-1234-',
      '1234-1234-1234-1234-1234-1234-',
      '1234-1234-1234-1234-1234-1234-',
    ]);

    readerPageManager.addPage(1, [
      '1234-1234-1234-1234-1234-1234-',
      '1234-1234-1234-1234-1234-1234-',
      '1234-1234-1234-1234-1234-1234-',
      '1234-1234-1234-1234-1234-1234-',
      '1234-1234-1234-1234-1234-1234-',
    ]);

    let pages = readerPageManager.render(0, renderConfig, false);

    expect(pages.length).toEqual(6);
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

    let reader = new ReaderPage(1, ['1234-1234-1234-1234-1234-1234-']);
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

    let reader = new ReaderPage(1, [
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
