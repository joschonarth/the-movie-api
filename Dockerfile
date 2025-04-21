FROM node:20

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

COPY wait-for-it.sh ./
RUN chmod +x wait-for-it.sh

COPY start.sh ./
RUN chmod +x start.sh

EXPOSE 3333

CMD ["./start.sh"]
