FROM node:20-bookworm-slim AS frontend-build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY index.html vite.config.js eslint.config.js ./
COPY public ./public
COPY src ./src
RUN npm run build

FROM node:20-bookworm-slim AS production

ENV NODE_ENV=production
WORKDIR /app/backend/src

COPY backend/src/package*.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY backend/src ./
COPY --from=frontend-build /app/dist /app/public

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/api/health').then(r => { if (!r.ok) process.exit(1) }).catch(() => process.exit(1))"

CMD ["node", "server.js"]
