import {range} from 'lodash-es';

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
};

export type ReaderConfig = {
  //最大可显示的ReaderPage
  buffer: number;
};

export class ReaderPageManager {
  pages: Map<number, ReaderPage> = new Map();
  config: ReaderConfig;

  constructor(config: ReaderConfig) {
    this.config = config;
  }

  addPage(pageId: number, data: string[]) {
    let renderPage = new ReaderPage(pageId, data);
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

    readerPages.forEach(readerPage => {
      target = target.concat(readerPage.render(config));
    });

    return target;
  }
}

export class ReaderPage {
  id: number;
  data: string[];

  constructor(id: number, data: string[]) {
    this.data = data;
    this.id = id;
  }

  getPageData(slice: PageSlice): string[] {
    return this.data.slice(slice.start, slice.end);
  }

  render(config: ReaderRenderConfig): Page[] {
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
      });
    });

    return target;
  }
}
