FROM node:20-alpine AS build
WORKDIR /app
COPY package.json pnpm-lock.yaml* tsconfig.json ./
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm install
COPY . .
RUN pnpm build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/dist ./dist
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm install --prod
EXPOSE 4000
CMD ["node","dist/index.js"]

