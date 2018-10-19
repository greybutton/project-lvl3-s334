#!/usr/bin/env node

import proccess from 'process';
import commander from 'commander';

import { version } from '../../package.json';
import pageLoader from '..';
import errors from '../errors';

export default commander
  .version(version, '-V, --version')
  .description('Page loader.')
  .arguments('<url>')
  .option('-o, --output [path]', 'Output path', __dirname)
  .action((url, options) => {
    pageLoader(url, options)
      .then(() => console.log(`success load ${url}`))
      .catch((e) => {
        proccess.exitCode = 1;
        console.error(`fail load ${url}`);
        const message = errors(e);
        console.error(message);
      });
  })
  .parse(process.argv);
