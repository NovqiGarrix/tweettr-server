
# tweettr - server

This repository contains the server side code for the tweettr application. The server is written in Node.js and uses the Express framework. 

## Getting Started

Create .env file, and check .env.example for reference.

### Installing

Run
```
# pnpm
pnpm install

# npm
npm install

# yarn
yarn install
```

## Running the tests

Run

```
# pnpm
pnpm test

# npm
npm run test

# yarn
yarn test
```

## Deployment

Will deploy using Docker to Digital Ocean.
Check Dockerfile and docker-compose.yml for reference.

## SSL Certificates

Will use Caddy to generate SSL certificates. Caddy will be running in a Docker container along with the server.