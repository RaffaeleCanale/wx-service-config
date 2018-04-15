FROM node
WORKDIR /etc/wx/

COPY src/ src/
COPY package*.json .babelrc ./

# There exists a bug that requires to build twice
RUN npm install && \
    npm run build && \
    npm run build

COPY config.json ./

CMD ["npm", "start"]
