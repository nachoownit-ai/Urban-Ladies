# 🚀 Guía de Instalación - Urban Ladies PRO

## Requisitos Previos

- Node.js 18+ (descarga desde https://nodejs.org/)
- Docker Desktop (descarga desde https://www.docker.com/products/docker-desktop)
- Git

## 📝 Pasos de Instalación

### 1️⃣ Iniciar la Base de Datos

```bash
docker-compose up -d
```

Esto levantará una instancia de PostgreSQL en `localhost:5432`

Verifica que la base de datos está lista:
```bash
docker-compose ps
```

### 2️⃣ Instalar Dependencias del Backend

```bash
cd backend
npm install
```

### 3️⃣ Instalar Dependencias del Frontend

```bash
cd ../frontend
npm install
```

### 4️⃣ Iniciar el Servidor Backend

En una terminal (desde la carpeta `/backend`):
```bash
npm run dev
```

Deberías ver:
```
✓ Database initialized successfully
✓ Server running on http://localhost:3001
```

### 5️⃣ Iniciar la Aplicación Frontend

En otra terminal (desde la carpeta `/frontend`):
```bash
npm start
```

Deberías ver:
```
  VITE v4.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

## 🔐 Credenciales de Prueba

Para registrarse usa cualquier email y contraseña, ej:
- Email: `test@example.com`
- Contraseña: `password123`

## 📱 Acceso

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001

## 🛑 Detener Servicios

### Detener la base de datos:
```bash
docker-compose down
```

### Eliminar datos de la base de datos:
```bash
docker-compose down -v
```

## 🔧 Troubleshooting

### Puerto 3001 o 5173 ya en uso

Cambia en:
- **Backend**: `backend/.env` → `PORT=3002`
- **Frontend**: `frontend/vite.config.ts` → `port: 5174`

### Problemas de conexión a BD

Verifica que Docker está corriendo:
```bash
docker ps
```

Si la BD no está, ejecuta:
```bash
docker-compose up -d
```

### Limpiar todo y reiniciar

```bash
docker-compose down -v
rm -rf backend/node_modules frontend/node_modules
npm install en ambas carpetas
```

## 📚 Próximos Pasos

Una vez todo esté corriendo:
1. Inicia sesión en http://localhost:5173
2. Explora el Dashboard
3. Prepárate para los siguientes módulos (Citas, Clientes, Servicios)

¡Feliz desarrollo! 🎉
