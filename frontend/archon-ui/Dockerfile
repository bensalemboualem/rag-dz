# Simple Vite dev server setup
FROM node:18-alpine

WORKDIR /app

# Install system dependencies needed for some npm packages
RUN apk add --no-cache python3 make g++ git curl

# Copy package files
COPY package*.json ./

# Install dependencies including dev dependencies for testing
RUN npm ci

# Create coverage directory with proper permissions
RUN mkdir -p /app/coverage && chmod 777 /app/coverage

# Copy source code
COPY . .

# Expose the port configured in package.json (3737)
EXPOSE 3737

# Create entrypoint script that generates .env.local from environment variables
RUN echo '#!/bin/sh' > /app/entrypoint.sh && \
    echo 'echo "VITE_API_SECRET_KEY=$VITE_API_SECRET_KEY" > /app/.env.local' >> /app/entrypoint.sh && \
    echo 'echo "VITE_API_URL=$VITE_API_URL" >> /app/.env.local' >> /app/entrypoint.sh && \
    echo 'echo "VITE_WS_URL=$VITE_WS_URL" >> /app/.env.local' >> /app/entrypoint.sh && \
    echo 'echo "VITE_SHOW_DEVTOOLS=$VITE_SHOW_DEVTOOLS" >> /app/.env.local' >> /app/entrypoint.sh && \
    echo 'exec npm run dev' >> /app/entrypoint.sh && \
    chmod +x /app/entrypoint.sh

# Start Vite dev server with environment variables
CMD ["/app/entrypoint.sh"]
