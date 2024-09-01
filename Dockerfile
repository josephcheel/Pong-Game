FROM node:latest

# Create app directory
COPY app /app
WORKDIR /app

# Install app dependencies
RUN npm install

# Expose port and start application
EXPOSE 3000
CMD ["npm", "start"]