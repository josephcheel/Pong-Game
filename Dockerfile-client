# Base image
FROM node:latest

# Create app directory
WORKDIR /app

# Install dependencies first by copying only the package.json and package-lock.json
# This ensures that npm install is re-run only when package files change
COPY app/package*.json ./

# Install app dependencies
RUN npm install

# Copy the entire app source code after installing dependencies
COPY app /app

# Install nginx
RUN apt-get update && apt-get install -y nginx

# Copy nginx config
COPY nginx/default /etc/nginx/sites-available/default

# Build the app
RUN npm run build

# Copy the built app files to the Nginx html directory
RUN cp -r /app/dist/* /var/www/html/
RUN cp -r /app/assets /var/www/html/

# Expose port 3000
EXPOSE 3000

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
