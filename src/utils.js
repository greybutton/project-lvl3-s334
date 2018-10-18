import url from 'url';
import path from 'path';

export const makeDest = (link, options) => {
  const { hostname, pathname } = url.parse(link);
  if (pathname === '/') {
    const filename = hostname
      .replace(/\W+/g, '-')
      .concat('.html');
    return path.join(options.output, filename);
  }
  const filename = hostname
    .concat(pathname)
    .replace(/\W+/g, '-')
    .concat('.html');
  const dest = path.join(options.output, filename);
  return dest;
};

export const makeFilesDest = (link) => {
  const { hostname, pathname } = url.parse(link);
  if (pathname === '/') {
    const dest = hostname
      .replace(/\W+/g, '-')
      .concat('_files');
    return dest;
  }
  const dest = hostname
    .concat(pathname)
    .replace(/\W+/g, '-')
    .concat('_files');
  return dest;
};

export const makeFullFilesDest = (filesDest, options) => path.join(options.output, filesDest);

export const changeFileDest = (dest, filename) => {
  const { dir, base } = path.parse(filename);
  if (dir === '/') {
    return path.join(dest, filename);
  }
  const newFileName = dir
    .slice(1)
    .replace(/\W+/g, '-')
    .concat(`-${base}`);
  const fileDest = path.join(dest, newFileName);
  return fileDest;
};

export const makeFileDest = (filesDest, fileUrl) => {
  const { pathname } = url.parse(fileUrl);
  const { dir, base } = path.parse(pathname);
  if (dir === '/') {
    return path.join(filesDest, pathname);
  }
  const filename = dir
    .slice(1)
    .replace(/\W+/g, '-')
    .concat(`-${base}`);
  const dest = path.join(filesDest, filename);
  return dest;
};
