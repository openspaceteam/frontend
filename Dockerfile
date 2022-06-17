FROM node:8.9.0 AS builder
WORKDIR /app

COPY *.json ./
RUN npm install

COPY . .


RUN npm run build

FROM nginx:stable-alpine

COPY ./docker.nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
