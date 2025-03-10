import {range} from 'lodash-es';

export interface ReaderSource {
  getPage(pageId: number): Promise<string[] | undefined>;
}

export type ReaderRenderConfig = {
  height: number;
  width: number;
  fontSize: number;
  lineHeight: number;
};

function calculateParagraph(
  text: string,
  lineHeight: number,
  lineCount: number,
): number {
  let maxLine = Math.ceil(text.length / lineCount);
  return maxLine * lineHeight;
}

export type PageSlice = {
  start: number;
  end: number;
};

export type Page = {
  data: string[];
  key: string;
  loading: boolean;
  error: boolean;
  empty: boolean;
};

export type ReaderConfig = {
  //最大可显示的ReaderPage
  buffer: number;
};

export class ReaderPageManager {
  pages: Map<number, ReaderPage> = new Map();
  config: ReaderConfig;
  source: ReaderSource;

  pageIndexToPageId: Map<number, number> = new Map();

  constructor(source: ReaderSource, config: ReaderConfig) {
    this.source = source;
    this.config = config;
  }

  async initialization(currentPage: number) {
    let pageIds = this.getCurrentPageIndexs(currentPage);

    let pageDatas = await Promise.all(
      pageIds.map(pageId => {
        return this.tryFetchPage(pageId);
      }),
    );

    pageIds.forEach((pageId, index) => {
      let pageData = pageDatas[index];

      if (pageData.error) {
        this.addErrorPage(pageId);
      } else {
        this.addPage(pageId, pageData.data);
      }
    });
  }

  async tryFetchPage(pageId: number) {
    let target: {
      data: string[] | undefined;
      error: boolean;
    } = {
      error: false,
      data: undefined,
    };

    try {
      let data = await this.source.getPage(pageId);
      target.data = data;
    } catch (error) {
      target.error = true;
    }

    return target;
  }

  getPageId(pageIndex: number): number {
    return this.pageIndexToPageId.get(pageIndex) as number;
  }

  fetchPage(pageId: number) {
    return this.source.getPage(pageId);
  }

  addLoadingPage(pageId: number) {
    let renderPage = new ReaderPage(pageId);
    this.pages.set(pageId, renderPage);
  }

  addErrorPage(pageId: number) {
    let renderPage = new ReaderPage(pageId);
    renderPage.loading = false;
    renderPage.error = true;
    this.pages.set(pageId, renderPage);
  }

  addPage(pageId: number, data: string[] | undefined) {
    console.log('ddd', pageId, data);

    let renderPage = new ReaderPage(pageId);
    renderPage.setData(data);
    this.pages.set(pageId, renderPage);
  }

  getCurrentPageIndexs(currentPage: number): number[] {
    let half = Math.floor(this.config.buffer / 2);
    let start = Math.max(0, currentPage - half);
    let end = currentPage + half;
    return range(start, end);
  }

  getCurrentPages(currentPage: number): ReaderPage[] {
    let target: ReaderPage[] = [];

    this.getCurrentPageIndexs(currentPage).forEach(index => {
      let page = this.pages.get(index);
      if (page) {
        target.push(page);
      }
    });

    return target;
  }

  render(
    currentPage: number,
    config: ReaderRenderConfig,
    _forceUpdate: boolean,
  ): Page[] {
    let readerPages = this.getCurrentPages(currentPage);

    let target: Page[] = [];

    let pageIndex = 0;
    let pageIndexToPageId: Map<number, number> = new Map();

    readerPages.forEach(readerPage => {
      let pageId = readerPage.id;
      let pages = readerPage.render(config);

      range(0, pages.length).forEach(_ => {
        pageIndexToPageId.set(pageIndex, pageId);
        pageIndex += 1;
      });

      target = target.concat(pages);
    });

    this.pageIndexToPageId = pageIndexToPageId;

    return target;
  }
}

export class ReaderPage {
  id: number;
  data: string[] = [];
  loading: boolean = false;
  error: boolean = false;
  empty: boolean = false;

  constructor(id: number) {
    this.id = id;
    this.loading = true;
    this.error = false;
  }

  setData(data: string[] | undefined) {
    if (data) {
      this.data = data;
    } else {
      this.empty = true;
    }

    this.loading = false;
    this.error = false;
  }

  getPageData(slice: PageSlice): string[] {
    return this.data.slice(slice.start, slice.end);
  }

  render(config: ReaderRenderConfig): Page[] {
    if (this.loading || this.error || this.empty) {
      let key = `page_${this.id}}`;

      if (this.loading) {
        key = key + '_loading';
      }

      if (this.error) {
        key = key + '_error';
      }

      return [
        {
          key,
          data: [],
          loading: this.loading,
          error: this.error,
          empty: this.empty,
        },
      ];
    }

    let lineCount = Math.ceil(config.width / config.fontSize);

    let page = 0;

    let pageHeight = 0;
    let prevPageHeight = 0;

    let preDataIndex = 0;

    let pageMap = new Map<number, PageSlice>();

    this.data.forEach((text, index) => {
      let paragraphHeight = calculateParagraph(
        text,
        config.lineHeight,
        lineCount,
      );

      prevPageHeight = pageHeight;
      pageHeight += paragraphHeight;

      if (prevPageHeight < config.height && pageHeight >= config.height) {
        pageHeight = paragraphHeight;
        prevPageHeight = 0;

        pageMap.set(page, {start: preDataIndex, end: index});

        preDataIndex = index;
        page = page + 1;
      }
    });

    if (pageHeight !== 0 || preDataIndex === this.data.length - 1) {
      pageMap.set(page, {start: preDataIndex, end: this.data.length});
    }

    let target: Page[] = [];

    Array.from(pageMap.entries()).forEach(item => {
      let pageIndex = item[0];
      let slice = item[1];

      let key = `page_${this.id}_${pageIndex}`;

      target.push({
        key,
        data: this.getPageData(slice),
        loading: false,
        error: false,
        empty: false,
      });
    });

    return target;
  }
}
