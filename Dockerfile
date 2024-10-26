# Use the official Node.js 18 image as a base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json (if available) into the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application source code into the container
COPY . .

# Build the NestJS app
RUN npm run build

# Expose the port your NestJS app runs on (usually 8080)
EXPOSE 8080

# Command to run the application
CMD ["npm", "run", "start:prod"]
