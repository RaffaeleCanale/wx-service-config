FROM node
WORKDIR /etc/wx/

COPY package*.json .babelrc ./

# There exists a bug that requires to build twice
RUN npm install

COPY src/ src/

# There exists a bug that requires to build twice
RUN npm run build && \
    npm run build

COPY config.json ./

CMD ["npm", "start"]
