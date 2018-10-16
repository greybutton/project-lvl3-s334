import os from 'os';
import url from 'url';
import path from 'path';
import { promises as fsPromises } from 'fs';
import nock from 'nock';
import axios from 'axios';
import httpAdapter from 'axios/lib/adapters/http';

import pageLoader from '../src';

const host = 'http://localhost';

axios.defaults.adapter = httpAdapter;

const makeDest = (link, options) => {
  const { hostname, pathname } = url.parse(link);
  const filename = hostname
    .concat(pathname)
    .replace(/\W+/g, '-')
    .concat('.html');
  const dest = path.join(options.output, filename);
  return dest;
};

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

    await pageLoader(link, options);
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

    await pageLoader(link, options);
    const received = await fsPromises.readFile(dest, { encoding: 'utf8' });

    expect(received).toBe(expected);
  });
});
