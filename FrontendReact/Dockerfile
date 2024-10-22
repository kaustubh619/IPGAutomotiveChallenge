# Use Node.js base image
FROM node:18-alpine

# Set the main working directory for the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to install dependencies
COPY weather_app_frontend/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY weather_app_frontend/ .

# Expose the port the app runs on
EXPOSE 3000

# Command to run the app
CMD ["npm", "start"]
