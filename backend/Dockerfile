# backend/Dockerfile

FROM node:18-alpine

# Create app directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy entire backend code
COPY . .

# Expose backend port
EXPOSE 5000

# Start the server
CMD ["npm", "run", "dev"]
