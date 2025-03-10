import {Reader, ReaderSource} from '@components/Reader';

const testReaderSource: ReaderSource = {
  async getPage(pageId) {
    if (pageId < 10) {
      return [
        '1234-1234-1234-1234-1234-1234-',
        '1234-1234-1234-1234-1234-1234-',
        '1234-1234-1234-1234-1234-1234-',
        '1234-1234-1234-1234-1234-1234-',
        '1234-1234-1234-1234-1234-1234-',
      ];
    } else if (pageId < 12) {
      throw 'ddd';
    } else {
      return undefined;
    }
  },
};

export function ReaderSceen() {
  return <Reader source={testReaderSource} />;
}
