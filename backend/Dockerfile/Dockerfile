FROM node:18-alpine
WORKDIR /app

# Install dependencies
COPY backend/package*.json ./
RUN npm install --production

# Copy app source
COPY backend/ .

ENV PORT=5000
EXPOSE 5000

CMD ["node", "server.js"]
