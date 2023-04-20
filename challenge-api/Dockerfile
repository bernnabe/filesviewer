FROM node:18

WORKDIR /app

COPY package.json package-lock.json /app/
COPY . /app

RUN npm ci --omit=dev

EXPOSE 3001

CMD ["node", "src/app.js"]