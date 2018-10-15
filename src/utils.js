import url from 'url';
import path from 'path';

export default (link, options) => {
  const { hostname, pathname } = url.parse(link);
  const filename = hostname
    .concat(pathname)
    .replace(/\W+/g, '-')
    .concat('.html');
  const dest = path.join(options.output, filename);
  return dest;
};
