FROM node:12.4.0

# create app directory in container
RUN mkdir -p /app

# set /app directory as default working directory
WORKDIR /app

# only copy package.json initially so that `RUN npm install` layer is recreated only
# if there are changes in package.json
ADD package.json yarn.lock /app/

# install node packages (including dev)
RUN yarn install

# copy all file from current dir to /app in container
COPY . /app/

# build project
RUN NODE_ENV=production npm run copy-assets
# build with increased memory (typescript compiler requires a large amount of memory)
RUN node --max-old-space-size=2048 node_modules/typescript/bin/tsc

# cmd to start service
# Entrypoint is used in docker-compose.yml
#CMD [ "npm", "start" ]
