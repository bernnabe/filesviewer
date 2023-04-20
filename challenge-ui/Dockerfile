FROM node:18
WORKDIR /app

COPY package.json package-lock.json /app/
COPY . /app

ENV API_BASE_URL=http://api:3000/

RUN npm ci --omit=dev

EXPOSE 3000 

CMD ["npm", "start"]