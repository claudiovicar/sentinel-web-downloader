# Baixador de imagens Sentinel

### Executando:

 - Frontend: `npm run serve`
 - Raiz: `sudo docker-compose build; sudo docker-compose up`


## Alguns comandos Docker
 - sudo docker ps -l
 - sudo docker images

### Acessando um container:
 - `docker exec -ti server /bin/bash` (para acessar o container de nome 'server', por exemplo)

### Commit nas mudanças
 - sudo docker commit cba971e2b448 node-with-gdal

### Problemas com rede
 - DNS: https://development.robinwinslow.uk/2016/06/23/fix-docker-networking-dns/
