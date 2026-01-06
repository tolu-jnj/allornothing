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
COPY --from=builder /app/dist /var/www/html

# Copy nginx config
RUN echo 'server { \
    listen ${PORT:-80}; \
    root /var/www/html; \
    location / { \
        try_files $uri $uri/ /index.html; \
        add_header Service-Worker-Allowed "/"; \
    } \
    location ~ \.(js|css|woff2|svg|png|jpg|jpeg|gif|ico)$ { \
        add_header Cache-Control "public, max-age=31536000, immutable"; \
    } \
    location /sw.js { \
        add_header Cache-Control "public, max-age=0, must-revalidate"; \
    } \
}' > /etc/nginx/conf.d/default.conf.template

# Install envsubst (comes with gettext)
RUN apk add --no-cache gettext

EXPOSE 8080

CMD ["sh", "-c", "envsubst '\\$PORT' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
