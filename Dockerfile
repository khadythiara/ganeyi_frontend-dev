FROM node:14-alpine AS builder

WORKDIR /app

COPY . .

ARG environment

RUN npm install && \
    ./node_modules/.bin/ng build --configuration=$environment --output-path=dist

# nginx state for serving content
FROM nginx:alpine

# Copy static assets from builder stage
COPY --from=builder /app/dist/  /usr/share/nginx/html/

COPY nginx.conf /etc/nginx/nginx.conf 

# Containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]