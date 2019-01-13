FROM node:10.13

WORKDIR /usr/src/baixador-sentinel
ENV NODE_ENV development
ENV PORT 8123

COPY backend/package.json /usr/src/baixador-sentinel/package.json

RUN npm install -g nodemon

RUN npm install --production

# COPY backend/.env.dev /usr/src/baixador-sentinel/.env.dev
COPY backend/ /usr/src/baixador-sentinel

# CMD ["npm", "start"]
# CMD ["./node_modules/nodemon/bin/nodemon.js", "app.js"]

EXPOSE 8123
