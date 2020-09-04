FROM node:alpine
    RUN npm install -g mocha
    RUN npm install chai
    COPY package*.json .  ./
    CMD ["npm", "test"]