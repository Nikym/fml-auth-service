FROM node:13.8.0-alpine
COPY . /app
RUN cd /app
RUN npm install
CMD npm run start