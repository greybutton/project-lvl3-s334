FROM node:10-alpine
RUN apk update && apk add make && apk add asciinema
WORKDIR /code