# Install dependencies only when needed
FROM node:18-slim AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
#RUN apk add --no-cache libc6-compat
RUN apt-get update
RUN apt-get install -y openssl
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# If using npm with a `package-lock.json` comment out above and use below instead
# COPY package.json package-lock.json ./
# RUN npm ci

# Rebuild the source code only when needed
FROM node:18-slim AS builder
WORKDIR /app
RUN mkdir /app/data
RUN mkdir /app/data/logs
RUN mkdir /app/data/sessions
RUN mkdir /app/data/database

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN yarn prisma:migrate
RUN yarn prisma:generate


RUN yarn build

# Production image, copy all the files and run next
FROM node:18-slim AS runner
RUN apt-get update
RUN apt-get install -y openssl
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

COPY --from=builder --chown=nodejs:nodejs /app/ ./
#RUN yarn run prisma:generate
#RUN yarn run prisma:migrate


USER nodejs

EXPOSE 3000
ENV PORT 3000

CMD ["node", "./dist/server.js"]
