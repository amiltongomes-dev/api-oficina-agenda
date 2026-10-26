FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
#RUN npm install

RUN npm ci

# Copia todo o código e o tsconfig.json
COPY . .

RUN npx prisma generate
# Compila o código TypeScript para a pasta dist
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]