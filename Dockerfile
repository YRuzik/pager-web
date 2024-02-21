FROM node:alpine AS builder

WORKDIR /app

COPY package*.json .

RUN npm install

ARG WSHOST
ARG ATHOST
ARG APIWSHOST

ENV WSHOST $WSHOST
ENV ATHOST $ATHOST
ENV APIWSHOST $APIWSHOST

COPY . .

RUN npm run build

FROM nginx:1.21.0-alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
