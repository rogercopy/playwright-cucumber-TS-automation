FROM mcr.microsoft.com/playwright:v1.53.2-jammy

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ENV HEADLESS=true

CMD ["npm", "run", "test:ui:ci"]
