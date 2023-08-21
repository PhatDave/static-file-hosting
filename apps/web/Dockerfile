FROM nginx:stable-alpine3.17

LABEL author="PhatDave"

WORKDIR /app

COPY ./build/ ./
COPY ./nginx.conf /etc/nginx/nginx.conf

EXPOSE 8080
