# Stage 1: Build the React application
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
# Install dependencies, including devDependencies for the build process
RUN npm install
# Copy all source files
COPY . .
# Run the build command (creates the 'dist' folder by default in a Vite app)
RUN npm run build

# Stage 2: Serve the compiled application using Nginx
FROM nginx:alpine
# Copy the static production build files from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html
# Nginx runs on port 80 by default
EXPOSE 80

# Command to start Nginx (this is the default command for this base image)
CMD ["nginx", "-g", "daemon off;"]