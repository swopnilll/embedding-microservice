# Use an official Node.js image
FROM node:22-alpine AS base

# Set working directory
WORKDIR /app

# Copy dependency files first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project (excluding .dockerignore files)
COPY . .

# Build the TypeScript code
RUN npm run build

# Use node to run the compiled app
CMD ["node", "dist/server.js"]

# Expose the port (change if your app uses a different port)
EXPOSE 3000
