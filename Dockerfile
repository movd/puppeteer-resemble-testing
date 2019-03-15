FROM zenato/puppeteer:latest

USER root

COPY package.json /app/

COPY app.js /app/

RUN cd /app && npm install --quiet

WORKDIR /app

CMD node app.js