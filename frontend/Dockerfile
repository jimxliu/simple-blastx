FROM node:12.20.1-alpine3.10

WORKDIR /app

COPY ./frontend/package.json .

RUN npm install

COPY ./frontend .

EXPOSE 3000

CMD ["npm", "start"]