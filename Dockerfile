# Use node version 12.4.0
FROM node:12.4.0

# create app directory in container
RUN mkdir -p /app

# set /app directory as default working directory
WORKDIR /app

# only copy package.json initially so that `RUN npm install` layer is recreated only
# if there are changes in package.json
ADD package.json package-lock.json /app/

# install node packages (including dev)
RUN npm install

# copy all file from current dir to /app in container
COPY . /app/

# build project
RUN NODE_ENV=production npm run copy-assets
# build with increased memory (typescript compiler requires a big amount of memory)
RUN node --max-old-space-size=2048 node_modules/typescript/bin/tsc
#RUN NODE_ENV=production node --max_old_space_size=2048 $(which npm) run build

# expose port 4040
EXPOSE 4040

# cmd to start service
CMD [ "npm", "start" ]
