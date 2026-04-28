FROM node:22-bullseye-slim

WORKDIR /app

RUN apt-get update -y
# RUN apt install -y chromium

RUN yarn global add pm2

COPY package.json .
COPY yarn.lock .

RUN yarn install

COPY . .

RUN rm -rf .env*

RUN yarn build

EXPOSE 6767

CMD ["yarn", "serve"]