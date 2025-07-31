# Multi-stage build for NAMAS Architecture Website
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY server/package*.json ./server/

# Install dependencies
RUN npm install
RUN cd server && npm install

# Copy source code
COPY . .

# Build the React application
RUN npm run build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Install production dependencies for server
COPY server/package*.json ./
RUN npm ci --only=production

# Copy built React app and server files
COPY --from=build /app/build ./build
COPY --from=build /app/server ./
COPY --from=build /app/server/data ./data
COPY --from=build /app/server/uploads ./uploads

# Create uploads directory if it doesn't exist
RUN mkdir -p uploads data

# Set permissions
RUN chown -R node:node /app
USER node

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/api', (res) => process.exit(res.statusCode === 200 ? 0 : 1))"

# Start the server
CMD ["npm", "start"]