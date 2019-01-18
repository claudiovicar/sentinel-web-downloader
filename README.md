# Baixador de imagens Sentinel

### Executando:

 - Frontend: `npm run serve`
 - Backend: `nodemon app.js`
 - Raiz: `sudo docker-compose build; sudo docker-compose up`

### Acessando um container:
 - `docker exec -ti server /bin/bash` (para acessar o container de nome 'server', por exemplo)

### Problemas com rede
 - DNS: https://development.robinwinslow.uk/2016/06/23/fix-docker-networking-dns/