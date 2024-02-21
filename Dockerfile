FROM node:alpine AS builder

WORKDIR /app

COPY package*.json .

RUN npm install

ARG REACT_APP_WSHOST
ENV REACT_APP_WSHOST=$REACT_APP_WSHOST

ARG REACT_APP_ATHOST
ENV REACT_APP_ATHOST=$REACT_APP_ATHOST

ARG REACT_APP_APIWSHOST
ENV REACT_APP_APIWSHOST=$REACT_APP_APIWSHOST

COPY . .

RUN npm run buil

FROM nginx:1.21.0-alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
