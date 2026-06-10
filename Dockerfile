# Stage 1: Build the Angular app inside Node 22
FROM node:22 AS build
WORKDIR /app

# Copy package management files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all project source code files
COPY . .

# Compile the Angular app into production-ready static assets
RUN npm run build --configuration=production

# Stage 2: Serve the compiled app via an Nginx Web Server
FROM nginx:alpine

# Copies the built production assets from your specific folder 'worldcup-poll-ui'
COPY --from=build /app/dist/worldcup-poll-ui/browser /usr/share/nginx/html

# Expose port 80 internally inside the container
EXPOSE 80

# Start Nginx in the foreground so the container stays alive
CMD ["nginx", "-g", "daemon off;"]