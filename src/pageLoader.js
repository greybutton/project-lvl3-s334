import { promises as fsPromises } from 'fs';
import url from 'url';
import axios from 'axios';
import cheerio from 'cheerio';

import {
  makeDest, makeFilesDest, makeFullFilesDest, changeFileDest, makeFileDest,
} from './utils';

const changeHtml = (data, dest) => {
  const $ = cheerio.load(data);

  $('link[href^="/"]:not([href^="//"], [href$=".xml"])').map((i, elem) => {
    const fileDest = $(elem).attr('href');
    const newFileDest = changeFileDest(dest, fileDest);
    return $(elem).attr('href', newFileDest);
  });
  $('img[src^="/"]:not([src^="//"])').map((i, elem) => {
    const fileDest = $(elem).attr('src');
    const newFileDest = changeFileDest(dest, fileDest);
    return $(elem).attr('src', newFileDest);
  });
  $('script[src^="/"]:not([src^="//"])').map((i, elem) => {
    const fileDest = $(elem).attr('src');
    const newFileDest = changeFileDest(dest, fileDest);
    return $(elem).attr('src', newFileDest);
  });

  const html = $.html();
  return html;
};

const getUrls = (data) => {
  const $ = cheerio.load(data);

  const links = $('link[href^="/"]:not([href^="//"], [href$=".xml"])').map((i, elem) => $(elem).attr('href')).get();
  const images = $('img[src^="/"]:not([src^="//"])').map((i, elem) => $(elem).attr('src')).get();
  const scripts = $('script[src^="/"]:not([src^="//"])').map((i, elem) => $(elem).attr('src')).get();

  const result = [...links, ...images, ...scripts];
  return result;
};

export default (link, options) => {
  const { protocol, hostname } = url.parse(link);
  const dest = makeDest(link, options);
  const filesDest = makeFilesDest(link);
  const fullFilesDest = makeFullFilesDest(filesDest, options);

  return axios
    .get(link)
    .then(({ data }) => {
      const fileUrls = getUrls(data).map(pathname => url.format({ protocol, hostname, pathname }));
      const filePromises = fileUrls.map(fileUrl => axios.get(fileUrl, { responseType: 'arraybuffer' }));
      return Promise
        .all(filePromises)
        .then(responses => fsPromises
          .mkdir(fullFilesDest)
          .then(() => responses))
        .then(responses => responses.map((response) => {
          const { data: fileData, config: { url: urlFile } } = response;
          const fileDest = makeFileDest(fullFilesDest, urlFile);
          return fsPromises.writeFile(fileDest, fileData);
        }))
        .then(() => {
          const newHtml = changeHtml(data, filesDest);
          return newHtml;
        });
    })
    .then((data) => {
      fsPromises.writeFile(dest, data);
    });
};
