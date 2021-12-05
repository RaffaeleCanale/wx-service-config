from node:16

COPY package.json yarn.lock ./
RUN yarn install

COPY src/ src/
copy tsconfig.json .prettierrc.js .eslintrc.js ./

RUN yarn build

COPY config.json ./

CMD ["yarn", "start"]
