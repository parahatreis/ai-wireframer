FROM node:20-alpine
WORKDIR /app
COPY package.json yarn.lock .yarnrc.yml ./
RUN corepack enable && corepack prepare yarn@3.6.4 --activate
RUN yarn install
COPY . .
EXPOSE 3333
CMD ["yarn","dev"]

