# frontend/Dockerfile

FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and lock files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy app source
COPY . .

# Expose development server port (usually 3000)
EXPOSE 3000

# Run the dev server
CMD ["npm", "start"]
