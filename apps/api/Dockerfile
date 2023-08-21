FROM node:18-alpine

LABEL author="PhatDave"

WORKDIR /app

COPY dist/ ./
COPY package.json ./

# Apparently tsup embeds dependencies into the dist folder
# So we don't need to install
RUN npm install

EXPOSE 8080
ENTRYPOINT [ "node", "main.js" ]