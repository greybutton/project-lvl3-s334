import { promises as fsPromises } from 'fs';
import axios from 'axios';

import makeDest from './utils';

export default (link, options) => {
  const dest = makeDest(link, options);

  return axios
    .get(link)
    .then(({ data }) => fsPromises.writeFile(dest, data))
    .then(() => console.log(`success load ${link}`))
    .catch(e => console.log(`fail load ${link} ${e}`));
};
