FROM node:alpine
    WORKDIR /app
    RUN npm install
    COPY package*.json Main.js ./
    CMD ["node", "Main.js"] 