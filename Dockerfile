FROM node
WORKDIR /etc/wxcs/

COPY package*.json ./

RUN npm install

EXPOSE 4567
CMD ["npm", "start"]
