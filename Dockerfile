FROM node:13.8.0-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
ENTRYPOINT [ "npm", "run", "start" ]