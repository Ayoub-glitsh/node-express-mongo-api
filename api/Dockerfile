FROM node:20-alpine

WORKDIR /usr/src/app

# Set production environment for smaller footprint
ENV NODE_ENV=production

# Install only production dependencies
COPY package.json ./
RUN npm install --omit=dev --no-audit --no-fund

# Copy application source
COPY server.js ./

# Expose API port
EXPOSE 3000

# Run the service
CMD ["node", "server.js"]

