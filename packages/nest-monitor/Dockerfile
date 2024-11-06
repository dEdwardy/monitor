######## step 1 ########
FROM node:16.13.0-alpine AS BUILD_IMAGE

# 时区
ENV TZ=Asia/Shanghai

# Create app directory
WORKDIR /usr/src/app
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
# this is for npm
# COPY package*.json ./
# but we use yarn
COPY ["package.json", "yarn.lock",".env", "./"]
COPY ./patches ./patches
# npm comes with node
# RUN npm install
# if we use yarn, we need firstly install it
# RUN curl -o- -L https://yarnpkg.com/install.sh | bash
# equivalent for `npm ci`, see https://stackoverflow.com/a/58525708/1553656
# If you are building your code for production
# RUN npm ci --only=production

# 设置生产环境变量
# ENV NODE_ENV production

RUN yarn install --frozen-lockfile --registry=https://registry.npmmirror.com/ --unsafe-perm

# Bundle app source
COPY . .

RUN yarn build

RUN npm prune --production --legacy-peer-deps
######## step 2 ########

FROM node:16.13.0-alpine

WORKDIR /usr/src/app

COPY --from=BUILD_IMAGE /usr/src/app/dist ./dist

COPY --from=BUILD_IMAGE /usr/src/app/patches ./patches

COPY --from=BUILD_IMAGE /usr/src/app/.env ./.env

COPY --from=BUILD_IMAGE /usr/src/app/node_modules ./node_modules


CMD ["node","dist/main.js"]

EXPOSE 5003

