# Use node image that supports ARM64
FROM node:14-alpine AS builder

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install build dependencies and Vue CLI
RUN apk add --no-cache python3 make g++ \
    && npm install -g @vue/cli@4.5.19 \
    && npm install @popperjs/core@^2.11.8 \
    && npm install \
    && apk del python3 make g++

# Copy project files
COPY . .

FROM node:14-alpine

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app .

# Install Vue CLI in the final image
RUN npm install -g @vue/cli@4.5.19

EXPOSE 8080

# Add environment variables for Vue CLI
ENV VUE_CLI_BABEL_TRANSPILE_MODULES=true
ENV VUE_CLI_BABEL_TARGET_NODE=true

CMD ["npm", "run", "serve"] 