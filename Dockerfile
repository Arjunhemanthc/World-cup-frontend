# Stage 1: Build the Angular app inside Node 22
FROM node:22 AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build --configuration=production

# Stage 2: Serve the compiled app via an Nginx Web Server
FROM nginx:alpine

# Clear any default Nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy the built production assets from your folder
COPY --from=build /app/dist/worldcup-poll-ui/browser /usr/share/nginx/html

# 🛠️ FIXED: Overwrite the default Nginx configuration to support SPA Routing fallback
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]