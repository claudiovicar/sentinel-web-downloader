FROM node:10.13

WORKDIR /usr/src/baixador-sentinel-frontend

COPY frontend/ /usr/src/baixador-sentinel-frontend

RUN npm install

EXPOSE 8080
EXPOSE 8000

CMD ["npm", "run", "serve"]