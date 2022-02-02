# node starter
[![Code style: airbnb](https://img.shields.io/badge/code%20style-airbnb-blue.svg?style=flat-square)](https://github.com/airbnb/javascript)

## Run locally

### Prerequisites

- nvm https://github.com/creationix/nvm#installation (install node v16)
- [Docker](https://www.docker.com)

**Important:** Before starting development copy `.env.example` to `.env` and make changes for your local environment.

### Initial setup

#### 1. docker-compose
If you will be using docker-compose for local development, create a database volume.

```shell script
docker create volume --name=postgres-data
```
If you change the name, also change it in `docker-compose.yml`.

#### 2. Generate JWT keys

Generate your JWT by running script `scripts/generate_jwt_keys.sh` and copy the output to your `.env` file.

### Run the application locally

Install dependencies
```bash
yarn
```

Start database:
```bash
docker-compose up -d
```

Run the build (watch mode)
```bash
yarn build:watch 
```

Run the development server:
```bash
yarn start:dev
```

Server will run on http://localhost:5000 (swagger-ui on http://localhost:5000/docs)

### Run tests

Locally

```bash
yarn test
```

with coverage

```bash
yarn test:coverage
```

## Optional dependencies

- [axios](https://www.npmjs.com/package/axios) - Making API requests
- [Day.js](https://www.npmjs.com/package/dayjs) - Date & time library (parse, validate, manipulate, display) 

## Deployment

### Docker build

```bash
docker build -t <tag_name> .
```

# License

This project is licensed under the terms of the Mozilla Public License Version 2.0.
