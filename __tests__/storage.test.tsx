import {getSingleStorage} from '@tools/storage';
import {StateStorage} from 'zustand/middleware';

describe('storage test', () => {
  let storage: StateStorage;

  beforeAll(() => {
    storage = getSingleStorage();
  });

  it('functions correctly', async () => {
    await storage.setItem('testString', 'value');

    expect(await storage.getItem('testString')).toStrictEqual('value');

    await storage.removeItem('testBoolean');
  });
});
