# Build Stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Production Stage
FROM node:20-alpine
WORKDIR /app

# Copy package config and install only production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source code from builder
COPY --from=builder /app/src ./src

# Set ownership to non-root 'node' user
RUN chown -R node:node /app

# Switch to non-root user
USER node

EXPOSE 5001

HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget -q -O - http://localhost:5001/api/health || exit 1

CMD ["npm", "start"]
