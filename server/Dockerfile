FROM node:24-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --omit=dev

COPY . .

RUN mkdir -p uploads && chown -R node:node /app

USER node

EXPOSE 8000

CMD ["node", "index.js"]
