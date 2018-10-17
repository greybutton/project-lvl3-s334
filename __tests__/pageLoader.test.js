import os from 'os';
import path from 'path';
import { promises as fsPromises } from 'fs';
import nock from 'nock';
import axios from 'axios';
import httpAdapter from 'axios/lib/adapters/http';
import errors from 'errno';

import pageLoader from '../src';

const host = 'http://localhost';

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
    const filename = 'localhost-test.html';
    const dest = path.join(tempDir, filename);

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
    const filename = 'localhost-anothertest.html';
    const dest = path.join(tempDir, filename);

    nock(host)
      .get(testPath)
      .reply(200, expected);

    await pageLoader(link, options);
    const received = await fsPromises.readFile(dest, { encoding: 'utf8' });

    expect(received).toBe(expected);
  });
  test('not exist path', async () => {
    const expected = 'test data';
    const testPath = '/test';
    const options = {
      output: './not/exist/path',
    };
    const link = host.concat(testPath);

    nock(host)
      .get(testPath)
      .reply(200, expected);

    try {
      await pageLoader(link, options);
    } catch (e) {
      expect(e.code).toMatch(errors.code.ENOENT.code);
    }
  });
});
