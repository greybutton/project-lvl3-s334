#!/usr/bin/env node

import commander from 'commander';

import { version } from '../../package.json';
import pageLoader from '..';

export default commander
  .version(version, '-V, --version')
  .description('Page loader.')
  .arguments('<url>')
  .option('-o, --output [path]', 'Output path', './')
  .action((url, options) => {
    pageLoader(url, options)
      .then(() => console.log(`success load ${url}`))
      .catch(e => console.log(`fail load ${url} ${e}`));
  })
  .parse(process.argv);
