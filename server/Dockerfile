# ───────────────────────────────────────────────────────────────
# KRONOS · Backend (Express + Socket.io) — imagen para Koyeb
# ───────────────────────────────────────────────────────────────
FROM node:20-alpine

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Instalar dependencias primero (mejor caché de capas)
COPY package*.json ./
RUN npm install --omit=dev

# Copiar el resto del código del servidor
COPY . .

# Producción
ENV NODE_ENV=production

# Koyeb inyecta la variable PORT (8000 por defecto); el server la lee con
# process.env.PORT. EXPOSE es informativo.
EXPOSE 8000

# Arranque
CMD ["node", "server.js"]
