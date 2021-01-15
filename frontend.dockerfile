FROM node:12.20.1-alpine3.10

WORKDIR /app

COPY ./frontend .

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]