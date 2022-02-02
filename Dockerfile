FROM node:16-alpine as builder

# create app directory in container
RUN mkdir -p /app

# set /app directory as default working directory
WORKDIR /app

# only copy package.json initially so that `RUN npm install` layer is recreated only
# if there are changes in package.json
ADD package.json yarn.lock /app/

# Installing missing install dependencies
RUN apk --no-cache add git

# install node packages (including dev)
RUN yarn install

# copy all file from current dir to /app in container
COPY . /app/

# build project
RUN NODE_ENV=production yarn build

# Remove node modules that contains dev-dependencies
RUN rm -r node_modules

# Install only runtime dependencies
RUN yarn install --production

# Runtime image
FROM node:16-alpine

WORKDIR /app

COPY --from=builder /app/package.json ./
COPY --from=builder /app/.sequelizerc ./
COPY --from=builder /app/db db
COPY --from=builder /app/build build
COPY --from=builder /app/node_modules node_modules

# cmd to start the service
CMD [ "yarn", "start" ]
