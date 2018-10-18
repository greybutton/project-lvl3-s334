import os from 'os';
import path from 'path';
import { promises as fsPromises } from 'fs';
import nock from 'nock';
import axios from 'axios';
import httpAdapter from 'axios/lib/adapters/http';

import pageLoader from '../src';

const host = 'http://test.com';

axios.defaults.adapter = httpAdapter;

describe('page loader with resources', () => {
  const fixturesPathDocument = '__tests__/__fixtures__/resources/before/index.html';
  const fixturesPathStyle = '__tests__/__fixtures__/resources/before/style.css';
  const fixturesPathStyleFolder = '__tests__/__fixtures__/resources/before/folder/style.css';
  const fixturesPathImage = '__tests__/__fixtures__/resources/before/image.png';
  const fixturesPathImageFolder = '__tests__/__fixtures__/resources/before/folder/image.png';
  const fixturesPathScript = '__tests__/__fixtures__/resources/before/script.txt';
  const fixturesPathScriptFolder = '__tests__/__fixtures__/resources/before/folder/script.txt';

  describe('index path', () => {
    test('update html', async () => {
      const document = await fsPromises.readFile(fixturesPathDocument, { encoding: 'utf8' });
      const expectedStyle = await fsPromises.readFile(fixturesPathStyle, { encoding: 'utf8' });
      const expectedStyleFolder = await fsPromises.readFile(fixturesPathStyleFolder, { encoding: 'utf8' });
      const expectedImage = await fsPromises.readFile(fixturesPathImage, { encoding: 'utf8' });
      const expectedImageFolder = await fsPromises.readFile(fixturesPathImageFolder, { encoding: 'utf8' });
      const expectedScript = await fsPromises.readFile(fixturesPathScript, { encoding: 'utf8' });
      const expectedScriptFolder = await fsPromises.readFile(fixturesPathScriptFolder, { encoding: 'utf8' });

      const stylePath = '/style.css';
      const styleFolderPath = '/folder/style.css';
      const imagePath = '/image.png';
      const imageFolderPath = '/folder/image.png';
      const scriptPath = '/script.txt';
      const scriptFolderPath = '/folder/script.txt';

      const tempDir = await fsPromises.mkdtemp(
        path.resolve(os.tmpdir(), 'page-loader-greybutton-'),
      );
      const options = {
        output: tempDir,
      };
      const testPath = '/';
      const link = host.concat(testPath);
      const filename = 'test-com.html';
      const dest = path.join(tempDir, filename);

      nock(host)
        .get(testPath)
        .reply(200, document)
        .get(stylePath)
        .reply(200, expectedStyle)
        .get(styleFolderPath)
        .reply(200, expectedStyleFolder)
        .get(imagePath)
        .reply(200, expectedImage)
        .get(imageFolderPath)
        .reply(200, expectedImageFolder)
        .get(scriptPath)
        .reply(200, expectedScript)
        .get(scriptFolderPath)
        .reply(200, expectedScriptFolder);

      await pageLoader(link, options);

      const received = await fsPromises.readFile(dest, { encoding: 'utf8' });

      const linkTag = 'test-com_files/style.css';
      const linkTagFolder = 'test-com_files/folder-style.css';
      const linkTagExternal = '"//site.com/style.css"';
      const linkTagExternalSite = '"http://site.com/style.css"';
      const linkXml = '"/feed.xml"';
      const imageTag = 'test-com_files/image.png';
      const imageTagFolder = 'test-com_files/folder-image.png';
      const imageTagExternal = '"//site.com/image.png"';
      const imageTagExternalSite = '"http://site.com/image.png"';
      const scriptTag = 'test-com_files/script.txt';
      const scriptTagFolder = 'test-com_files/folder-script.txt';
      const scriptTagExternal = '"//site.com/script.txt"';
      const scriptTagExternalSite = '"http://site.com/script.txt"';
      const aTag = '/page';
      const aTagExternal = 'http://site.com';

      expect(received).toEqual(
        expect.stringContaining(linkTag),
        expect.stringContaining(linkTagFolder),
        expect.stringContaining(linkTagExternal),
        expect.stringContaining(linkTagExternalSite),
        expect.stringContaining(linkXml),
        expect.stringContaining(imageTag),
        expect.stringContaining(imageTagFolder),
        expect.stringContaining(imageTagExternal),
        expect.stringContaining(imageTagExternalSite),
        expect.stringContaining(scriptTag),
        expect.stringContaining(scriptTagFolder),
        expect.stringContaining(scriptTagExternal),
        expect.stringContaining(scriptTagExternalSite),
        expect.stringContaining(aTag),
        expect.stringContaining(aTagExternal),
      );
    });

    test('load resources', async () => {
      const document = await fsPromises.readFile(fixturesPathDocument, { encoding: 'utf8' });
      const expectedStyle = await fsPromises.readFile(fixturesPathStyle, { encoding: 'utf8' });
      const expectedStyleFolder = await fsPromises.readFile(fixturesPathStyleFolder, { encoding: 'utf8' });
      const expectedImage = await fsPromises.readFile(fixturesPathImage, { encoding: 'utf8' });
      const expectedImageFolder = await fsPromises.readFile(fixturesPathImageFolder, { encoding: 'utf8' });
      const expectedScript = await fsPromises.readFile(fixturesPathScript, { encoding: 'utf8' });
      const expectedScriptFolder = await fsPromises.readFile(fixturesPathScriptFolder, { encoding: 'utf8' });
      const expectedStylePath = '/style.css';
      const expectedStyleFolderPath = '/folder-style.css';
      const expectedImagePath = '/image.png';
      const expectedImageFolderPath = '/folder-image.png';
      const expectedScriptPath = '/script.txt';
      const expectedScriptFolderPath = '/folder-script.txt';

      const stylePath = '/style.css';
      const styleFolderPath = '/folder/style.css';
      const imagePath = '/image.png';
      const imageFolderPath = '/folder/image.png';
      const scriptPath = '/script.txt';
      const scriptFolderPath = '/folder/script.txt';

      const tempDir = await fsPromises.mkdtemp(
        path.resolve(os.tmpdir(), 'page-loader-greybutton-'),
      );
      const options = {
        output: tempDir,
      };

      const destFiles = 'test-com_files';
      const destStyle = path.join(tempDir, destFiles, expectedStylePath);
      const destStyleFolder = path.join(tempDir, destFiles, expectedStyleFolderPath);
      const destImage = path.join(tempDir, destFiles, expectedImagePath);
      const destImageFolder = path.join(tempDir, destFiles, expectedImageFolderPath);
      const destScript = path.join(tempDir, destFiles, expectedScriptPath);
      const destScriptFolder = path.join(tempDir, destFiles, expectedScriptFolderPath);

      const testPath = '/';
      const link = host.concat(testPath);

      nock(host)
        .get(testPath)
        .reply(200, document)
        .get(stylePath)
        .reply(200, expectedStyle)
        .get(styleFolderPath)
        .reply(200, expectedStyleFolder)
        .get(imagePath)
        .reply(200, expectedImage)
        .get(imageFolderPath)
        .reply(200, expectedImageFolder)
        .get(scriptPath)
        .reply(200, expectedScript)
        .get(scriptFolderPath)
        .reply(200, expectedScriptFolder);

      await pageLoader(link, options);

      const receivedStyle = await fsPromises.readFile(destStyle, { encoding: 'utf8' });
      const receivedStyleFolder = await fsPromises.readFile(destStyleFolder, { encoding: 'utf8' });
      const receivedImage = await fsPromises.readFile(destImage, { encoding: 'utf8' });
      const receivedImageFolder = await fsPromises.readFile(destImageFolder, { encoding: 'utf8' });
      const receivedScript = await fsPromises.readFile(destScript, { encoding: 'utf8' });
      const receivedScriptFolder = await fsPromises.readFile(destScriptFolder, { encoding: 'utf8' });

      expect(receivedStyle).toBe(expectedStyle);
      expect(receivedStyleFolder).toBe(expectedStyleFolder);
      expect(receivedImage).toBe(expectedImage);
      expect(receivedImageFolder).toBe(expectedImageFolder);
      expect(receivedScript).toBe(expectedScript);
      expect(receivedScriptFolder).toBe(expectedScriptFolder);
    });
  });
  describe('relative path', () => {
    test('update html', async () => {
      const document = await fsPromises.readFile(fixturesPathDocument, { encoding: 'utf8' });
      const expectedStyle = await fsPromises.readFile(fixturesPathStyle, { encoding: 'utf8' });
      const expectedStyleFolder = await fsPromises.readFile(fixturesPathStyleFolder, { encoding: 'utf8' });
      const expectedImage = await fsPromises.readFile(fixturesPathImage, { encoding: 'utf8' });
      const expectedImageFolder = await fsPromises.readFile(fixturesPathImageFolder, { encoding: 'utf8' });
      const expectedScript = await fsPromises.readFile(fixturesPathScript, { encoding: 'utf8' });
      const expectedScriptFolder = await fsPromises.readFile(fixturesPathScriptFolder, { encoding: 'utf8' });

      const stylePath = '/style.css';
      const styleFolderPath = '/folder/style.css';
      const imagePath = '/image.png';
      const imageFolderPath = '/folder/image.png';
      const scriptPath = '/script.txt';
      const scriptFolderPath = '/folder/script.txt';

      const tempDir = await fsPromises.mkdtemp(
        path.resolve(os.tmpdir(), 'page-loader-greybutton-'),
      );
      const options = {
        output: tempDir,
      };
      const testPath = '/test';
      const link = host.concat(testPath);
      const filename = 'test-com-test.html';
      const dest = path.join(tempDir, filename);

      nock(host)
        .get(testPath)
        .reply(200, document)
        .get(stylePath)
        .reply(200, expectedStyle)
        .get(styleFolderPath)
        .reply(200, expectedStyleFolder)
        .get(imagePath)
        .reply(200, expectedImage)
        .get(imageFolderPath)
        .reply(200, expectedImageFolder)
        .get(scriptPath)
        .reply(200, expectedScript)
        .get(scriptFolderPath)
        .reply(200, expectedScriptFolder);

      await pageLoader(link, options);

      const received = await fsPromises.readFile(dest, { encoding: 'utf8' });

      const linkTag = 'test-com-test_files/style.css';
      const linkTagFolder = 'test-com-test_files/folder-style.css';
      const linkTagExternal = '"//site.com/style.css"';
      const linkTagExternalSite = '"http://site.com/style.css"';
      const linkXml = '"/feed.xml"';
      const imageTag = 'test-com-test_files/image.png';
      const imageTagFolder = 'test-com-test_files/folder-image.png';
      const imageTagExternal = '"//site.com/image.png"';
      const imageTagExternalSite = '"http://site.com/image.png"';
      const scriptTag = 'test-com-test_files/script.txt';
      const scriptTagFolder = 'test-com-test_files/folder-script.txt';
      const scriptTagExternal = '"//site.com/script.txt"';
      const scriptTagExternalSite = '"http://site.com/script.txt"';
      const aTag = '/page';
      const aTagExternal = 'http://site.com';

      expect(received).toEqual(
        expect.stringContaining(linkTag),
        expect.stringContaining(linkTagFolder),
        expect.stringContaining(linkTagExternal),
        expect.stringContaining(linkTagExternalSite),
        expect.stringContaining(linkXml),
        expect.stringContaining(imageTag),
        expect.stringContaining(imageTagFolder),
        expect.stringContaining(imageTagExternal),
        expect.stringContaining(imageTagExternalSite),
        expect.stringContaining(scriptTag),
        expect.stringContaining(scriptTagFolder),
        expect.stringContaining(scriptTagExternal),
        expect.stringContaining(scriptTagExternalSite),
        expect.stringContaining(aTag),
        expect.stringContaining(aTagExternal),
      );
    });

    test('load resources', async () => {
      const document = await fsPromises.readFile(fixturesPathDocument, { encoding: 'utf8' });
      const expectedStyle = await fsPromises.readFile(fixturesPathStyle, { encoding: 'utf8' });
      const expectedStyleFolder = await fsPromises.readFile(fixturesPathStyleFolder, { encoding: 'utf8' });
      const expectedImage = await fsPromises.readFile(fixturesPathImage, { encoding: 'utf8' });
      const expectedImageFolder = await fsPromises.readFile(fixturesPathImageFolder, { encoding: 'utf8' });
      const expectedScript = await fsPromises.readFile(fixturesPathScript, { encoding: 'utf8' });
      const expectedScriptFolder = await fsPromises.readFile(fixturesPathScriptFolder, { encoding: 'utf8' });
      const expectedStylePath = '/style.css';
      const expectedStyleFolderPath = '/folder-style.css';
      const expectedImagePath = '/image.png';
      const expectedImageFolderPath = '/folder-image.png';
      const expectedScriptPath = '/script.txt';
      const expectedScriptFolderPath = '/folder-script.txt';

      const stylePath = '/style.css';
      const styleFolderPath = '/folder/style.css';
      const imagePath = '/image.png';
      const imageFolderPath = '/folder/image.png';
      const scriptPath = '/script.txt';
      const scriptFolderPath = '/folder/script.txt';

      const tempDir = await fsPromises.mkdtemp(
        path.resolve(os.tmpdir(), 'page-loader-greybutton-'),
      );
      const options = {
        output: tempDir,
      };

      const destFiles = 'test-com-test_files';
      const destStyle = path.join(tempDir, destFiles, expectedStylePath);
      const destStyleFolder = path.join(tempDir, destFiles, expectedStyleFolderPath);
      const destImage = path.join(tempDir, destFiles, expectedImagePath);
      const destImageFolder = path.join(tempDir, destFiles, expectedImageFolderPath);
      const destScript = path.join(tempDir, destFiles, expectedScriptPath);
      const destScriptFolder = path.join(tempDir, destFiles, expectedScriptFolderPath);

      const testPath = '/test';
      const link = host.concat(testPath);

      nock(host)
        .get(testPath)
        .reply(200, document)
        .get(stylePath)
        .reply(200, expectedStyle)
        .get(styleFolderPath)
        .reply(200, expectedStyleFolder)
        .get(imagePath)
        .reply(200, expectedImage)
        .get(imageFolderPath)
        .reply(200, expectedImageFolder)
        .get(scriptPath)
        .reply(200, expectedScript)
        .get(scriptFolderPath)
        .reply(200, expectedScriptFolder);

      await pageLoader(link, options);

      const receivedStyle = await fsPromises.readFile(destStyle, { encoding: 'utf8' });
      const receivedStyleFolder = await fsPromises.readFile(destStyleFolder, { encoding: 'utf8' });
      const receivedImage = await fsPromises.readFile(destImage, { encoding: 'utf8' });
      const receivedImageFolder = await fsPromises.readFile(destImageFolder, { encoding: 'utf8' });
      const receivedScript = await fsPromises.readFile(destScript, { encoding: 'utf8' });
      const receivedScriptFolder = await fsPromises.readFile(destScriptFolder, { encoding: 'utf8' });

      expect(receivedStyle).toBe(expectedStyle);
      expect(receivedStyleFolder).toBe(expectedStyleFolder);
      expect(receivedImage).toBe(expectedImage);
      expect(receivedImageFolder).toBe(expectedImageFolder);
      expect(receivedScript).toBe(expectedScript);
      expect(receivedScriptFolder).toBe(expectedScriptFolder);
    });
  });
});
