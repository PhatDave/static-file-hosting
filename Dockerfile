FROM node:18-alpine

LABEL author="PhatDave"

WORKDIR /app

COPY apps/api/dist/ ./
COPY apps/web/build/ ./web/

EXPOSE 8080
ENTRYPOINT [ "node", "main.cjs" ]