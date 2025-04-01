# Використовуємо офіційний Node.js образ
FROM node:20

# Встановлюємо робочу директорію всередині контейнера
WORKDIR /app

# Копіюємо package.json і package-lock.json у контейнер
COPY package*.json ./

# Встановлюємо залежності (без запуску серверу)
RUN npm install --omit=dev  

# Копіюємо решту коду
COPY . .

# Відкриваємо порт (той самий, що в Express)
EXPOSE 5000

# Встановлюємо змінні середовища для MongoDB (краще через аргумент)
ENV MONGO_URI=mongodb://db:27017/todoDB

# Запускаємо сервер
CMD ["npm", "start"]
