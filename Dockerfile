FROM node:alpine
WORKDIR /app
EXPOSE 5173
COPY package.json .
RUN npm i
COPY . .
CMD ["npm", "run", "dev"]