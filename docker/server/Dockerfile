FROM ubuntu:bionic

RUN apt-get update
RUN apt install -y curl
RUN curl -sL https://deb.nodesource.com/setup_10.x -o nodesource_setup.sh
RUN bash nodesource_setup.sh
RUN apt install -y nodejs
RUN apt install -y build-essential

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
RUN apt-get install -y software-properties-common libopenjp2-7
RUN apt install -y gdal-bin
RUN apt install -y python-gdal

# Fim da instalação do GDAL

RUN apt install -y gcc python-dev python-setuptools libffi-dev
RUN apt install -y python-pip
RUN pip install gsutil
RUN pip install --upgrade pyasn1-modules
