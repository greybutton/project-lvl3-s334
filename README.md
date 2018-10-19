[![Build Status][build-badge]][build]
[![Maintainability](https://api.codeclimate.com/v1/badges/fe40266f9b08c4ed400b/maintainability)](https://codeclimate.com/github/greybutton/project-lvl3-s334/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/fe40266f9b08c4ed400b/test_coverage)](https://codeclimate.com/github/greybutton/project-lvl3-s334/test_coverage)

[build-badge]: https://img.shields.io/travis/greybutton/project-lvl3-s334.svg?style=flat-square
[build]: https://travis-ci.org/greybutton/project-lvl3-s334

[https://asciinema.org/a/yHr61B9cels8g6Y5wWIcz85Wo](https://asciinema.org/a/yHr61B9cels8g6Y5wWIcz85Wo)

debug: [https://asciinema.org/a/M5T4Oi8ScesiohH2joecNSQfS](https://asciinema.org/a/M5T4Oi8ScesiohH2joecNSQfS)

error: [https://asciinema.org/a/zNhX3vfTaKxZN0OeRrGjk2oA2](https://asciinema.org/a/zNhX3vfTaKxZN0OeRrGjk2oA2)

listr: [https://asciinema.org/a/GtXQwtuBcmgxXT4g8jevOuqeo](https://asciinema.org/a/GtXQwtuBcmgxXT4g8jevOuqeo)

## Description

The utility for load the specified url from the network.

### Install

CLI: `npm install -g page-loader-greybutton`

Module: `npm install --save page-loader-greybutton`

### Use

CLI: `page-loader-greybutton --help`

Module:

```js
import pageLoader from "page-loader-greybutton";

pageLoader(url, output);
```

output: `/path/to/files` (default is `./`)

## Development

### Setup

```sh
make install
```

### Run tests

```sh
make test
```

### Docker

```
docker build -t <image-name:tag> .
```

```
docker run --rm -it -v "$(PWD)":/code <image-name:tag> command
```

### Asciinema

```
LC_ALL=en_US.UTF-8 asciinema rec/auth
```
