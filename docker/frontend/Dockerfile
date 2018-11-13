FROM node:10.13

WORKDIR /data_client/

COPY frontend/package.json /data_client/

RUN npm install

EXPOSE 8080

EXPOSE 8000

CMD ["npm", "run", "serve"]