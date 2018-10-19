import { promises as fsPromises } from 'fs';
import url from 'url';
import axios from 'axios';
import cheerio from 'cheerio';
import debug from 'debug';
import { keys, flatten } from 'lodash/fp';

import {
  makeDest, makeFilesDest, makeFullFilesDest, changeFileDest, makeFileDest,
} from './utils';

const log = debug('page-loader');

const tags = {
  link: {
    selector: 'link[href^="/"]:not([href^="//"], [href$=".xml"])',
    attr: 'href',
  },
  img: {
    selector: 'img[src^="/"]:not([src^="//"])',
    attr: 'src',
  },
  script: {
    selector: 'script[src^="/"]:not([src^="//"])',
    attr: 'src',
  },
};

const changeHtml = (data, dest) => {
  const $ = cheerio.load(data);

  keys(tags).forEach((key) => {
    $(tags[key].selector).map((i, elem) => {
      const fileDest = $(elem).attr(tags[key].attr);
      const newFileDest = changeFileDest(dest, fileDest);
      return $(elem).attr(tags[key].attr, newFileDest);
    });
  });

  const html = $.html();
  return html;
};

const getUrls = (data) => {
  const $ = cheerio.load(data);
  const links = keys(tags)
    .map(key => $(tags[key].selector).map((i, elem) => $(elem).attr(tags[key].attr)).get());
  const result = flatten(links);
  return result;
};

export default (link, options) => {
  const { protocol, hostname } = url.parse(link);
  if (!protocol && !hostname) {
    const message = `incorrent url ${link}`;
    throw new Error(message);
  }
  const dest = makeDest(link, options);
  const filesDest = makeFilesDest(link);
  const fullFilesDest = makeFullFilesDest(filesDest, options);

  let filesData = [];
  let html = '';

  return axios
    .get(link)
    .then(({ data }) => {
      html = changeHtml(data, filesDest);
      const fileUrls = getUrls(data).map(pathname => url.format({ protocol, hostname, pathname }));
      const filePromises = fileUrls.map(fileUrl => axios
        .get(fileUrl, { responseType: 'arraybuffer' })
        .then((response) => {
          log('load file', fileUrl);
          return response;
        }));
      return filePromises;
    })
    .then(promises => Promise.all(promises))
    .then((responses) => { filesData = responses; })
    .then(() => fsPromises.writeFile(dest, html))
    .then(() => log('create main file', dest))
    .then(() => fsPromises.mkdir(fullFilesDest))
    .then(() => log('create files directory', fullFilesDest))
    .then(() => filesData.map((response) => {
      const { data: fileData, config: { url: urlFile } } = response;
      const fileDest = makeFileDest(fullFilesDest, urlFile);
      fsPromises.writeFile(fileDest, fileData);
      return fileDest;
    }))
    .then(subFilesDests => subFilesDests.forEach(item => log('create sub file', item)));
};
