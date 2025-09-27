# Stage 1: Build the application dependencies
FROM node:20-alpine AS builder
WORKDIR /app
# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./
# Install production dependencies only (devDependencies like nodemon are not needed for the container)
RUN npm install --only=production

# Stage 2: Create the final production image
FROM node:20-alpine
WORKDIR /app
# Copy installed dependencies from the builder stage
COPY --from=builder /app/node_modules ./node_modules
# Copy the rest of the application code
COPY . .

# The application runs on PORT 5000 (from your .env file)
EXPOSE 5000

# Command to start the application
CMD ["node", "server.js"]