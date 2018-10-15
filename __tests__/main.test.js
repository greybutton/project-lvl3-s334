import os from 'os';
import path from 'path';
import { promises as fsPromises } from 'fs';
import nock from 'nock';
import axios from 'axios';
import httpAdapter from 'axios/lib/adapters/http';

import main from '../src';
import makeDest from '../src/utils';

const host = 'http://localhost';

axios.defaults.host = host;
axios.defaults.adapter = httpAdapter;

describe('page loader', () => {
  test('test', async () => {
    const expected = 'test data';
    const testPath = '/test';
    const tempDir = await fsPromises.mkdtemp(
      path.resolve(os.tmpdir(), 'page-loader-greybutton-'),
    );
    const options = {
      output: tempDir,
    };
    const link = host.concat(testPath);
    const dest = makeDest(link, options);

    nock(host)
      .get(testPath)
      .reply(200, expected);

    await main(link, options);
    const received = await fsPromises.readFile(dest, { encoding: 'utf8' });

    expect(received).toBe(expected);
  });
  test('another test', async () => {
    const expected = 'another test data';
    const testPath = '/anothertest';
    const tempDir = await fsPromises.mkdtemp(
      path.resolve(os.tmpdir(), 'page-loader-greybutton-'),
    );
    const options = {
      output: tempDir,
    };
    const link = host.concat(testPath);
    const dest = makeDest(link, options);

    nock(host)
      .get(testPath)
      .reply(200, expected);

    await main(link, options);
    const received = await fsPromises.readFile(dest, { encoding: 'utf8' });

    expect(received).toBe(expected);
  });
});
