FROM node:latest

# Create app directory
COPY app /app
WORKDIR /app

RUN apt-get update && apt-get install -y nginx

COPY  nginx/default /etc/nginx/sites-available/default
# Install app dependencies
RUN npm install

# Expose port and start application
EXPOSE 3000
RUN npm run build
RUN cp -r /app/dist/* /var/www/html/
RUN cp -r /app/fonts /var/www/html/
CMD nginx -g 'daemon off;'