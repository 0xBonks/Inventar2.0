# Use node image that supports ARM64
FROM node:14-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN apk add --no-cache python3 make g++ \
    && npm install -g sequelize-cli \
    && npm install \
    && apk del python3 make g++

COPY . .

FROM node:14-alpine

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app .

# Install required tools and set up scripts
RUN apk add --no-cache netcat-openbsd \
    && npm install -g sequelize-cli \
    && npm install -g nodemon \
    && chmod +x ./scripts/wait-for-it.sh \
    && chmod +x ./scripts/start.sh

# Add debugging
ENV NODE_ENV=development
ENV DEBUG=express:*

EXPOSE 3000

# Use shell to run the script
CMD ["/bin/sh", "./scripts/start.sh"] 