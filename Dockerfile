FROM node:24.12-alpine AS base


# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci


# Build storybook
FROM base AS builder
WORKDIR /app

COPY . .
COPY --from=deps /app/node_modules ./node_modules

ENV STORYBOOK_DISABLE_TELEMETRY=1

RUN npm run build-storybook


# Production image with nginx
FROM nginx:alpine AS runner

# Copy built storybook
COPY --from=builder /app/storybook-static /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

ARG CI_COMMIT_SHA
LABEL git-commit=$CI_COMMIT_SHA
LABEL project=ftools
