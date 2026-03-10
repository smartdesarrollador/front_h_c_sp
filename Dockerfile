# ── Stage 1: dependencias ─────────────────────────────────
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci

# ── Stage 2: desarrollo (Vite dev server) ─────────────────
FROM base AS dev
COPY . .
EXPOSE 5175
CMD ["npm", "run", "dev"]

# ── Stage 3: build ────────────────────────────────────────
FROM base AS builder
COPY . .
ARG VITE_API_URL
ARG VITE_APP_NAME
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_APP_NAME=${VITE_APP_NAME}
RUN npm run build

# ── Stage 4: producción (nginx estático) ─────────────────
FROM nginx:1.25-alpine AS prod
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
