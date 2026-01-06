FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with legacy peer deps flag
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build for web
RUN npm run build:web

# Production image
FROM nginx:alpine

# Copy built app to nginx
COPY --from=builder /app/dist /var/www/aon

# Copy nginx config
RUN echo 'server { \
    listen 80; \
    root /var/www; \
    location /aon { \
        try_files $uri $uri/ /aon/index.html; \
        add_header Service-Worker-Allowed "/"; \
    } \
    location ~ \.(js|css|woff2|svg|png|jpg|jpeg|gif|ico)$ { \
        add_header Cache-Control "public, max-age=31536000, immutable"; \
    } \
    location /aon/sw.js { \
        add_header Cache-Control "public, max-age=0, must-revalidate"; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
