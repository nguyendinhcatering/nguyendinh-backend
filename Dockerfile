FROM node:12-alpine
WORKDIR /usr/app
COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm install --silent
COPY . .

EXPOSE 1337

ENV NODE_ENV=production

RUN npm run build

CMD npm run start

