import * as fs from 'fs';

import { plugins } from '../../src/plugins';

describe('./src/plugins/index.ts', () => {
  const files: ReadonlyArray<string> = fs
    .readdirSync('./src/plugins')
    .filter((file) => file !== 'index.ts' && file.endsWith('.ts'));

  it('imports all available rule modules', () => {
    expect(plugins).toHaveLength(files.length);
  });
});
