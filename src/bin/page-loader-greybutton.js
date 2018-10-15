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
    console.log(pageLoader(url, options));
  })
  .parse(process.argv);
