FROM node:10.13

WORKDIR /usr/src/baixador-sentinel
ENV NODE_ENV development
ENV PORT 8123

COPY backend/package.json /usr/src/baixador-sentinel/package.json

RUN npm install -g nodemon

RUN npm install --production

COPY backend/ /usr/src/baixador-sentinel

EXPOSE 8123
EXPOSE 9229



# Instalação do GDAL

RUN apt-get update
RUN apt-get install -y software-properties-common
RUN apt install -y gdal-bin
RUN apt install -y python-gdal

# Fim da instalação do GDAL
