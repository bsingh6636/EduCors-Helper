FROM node:24-alpine
ENV NODE_ENV=production LISTEN_HOST=0.0.0.0
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
USER node
EXPOSE 9090
CMD ["node", "index.js"]
