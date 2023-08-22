FROM node:18-alpine

LABEL author="PhatDave"

WORKDIR /app

COPY apps/api/dist/ ./
COPY apps/web/build/ ./web/
COPY apps/api/package.json ./

RUN npm install --omit-dev

EXPOSE 8080
ENTRYPOINT [ "node", "main.js" ]