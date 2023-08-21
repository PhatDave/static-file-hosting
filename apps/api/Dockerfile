FROM node:18-alpine

LABEL author="PhatDave"

WORKDIR /app

COPY dist/ ./
COPY package.json ./

RUN npm install

EXPOSE 8080
ENTRYPOINT [ "node", "main.js" ]