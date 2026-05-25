# Urban Ladies PRO - CLAUDE.md

## 📊 Descripción del Proyecto

Sistema integral de gestión para salones de belleza. Aplicación web profesional y escalable desarrollada con:

- **Backend**: Node.js + Express + TypeScript
- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Database**: PostgreSQL
- **Auth**: JWT
- **State**: Zustand
- **API Calls**: Axios + React Query

## 🏗️ Estructura del Proyecto

```
.
├── backend/              # API REST
│   ├── src/
│   │   ├── config/       # Configuración (env.ts)
│   │   ├── controllers/  # Lógica de negocio
│   │   ├── middleware/   # Auth, errorHandler
│   │   ├── routes/       # Rutas de API
│   │   ├── types/        # TypeScript interfaces
│   │   ├── db.ts         # Conexión PostgreSQL
│   │   └── index.ts      # Entry point
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env              # Variables (en .gitignore)
│   └── .env.example      # Template
│
├── frontend/             # React app
│   ├── src/
│   │   ├── api/          # Cliente HTTP
│   │   ├── components/   # Componentes React
│   │   ├── pages/        # Páginas
│   │   ├── store/        # Zustand stores
│   │   ├── types/        # TypeScript interfaces
│   │   ├── App.tsx       # Root component
│   │   ├── main.tsx      # Entry point
│   │   └── index.css     # Estilos globales
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── index.html
│
├── docker-compose.yml    # PostgreSQL
├── SETUP.md              # Instrucciones de instalación
├── README.md
└── .gitignore

```

## 🚀 Para Empezar

### 1. Instalar dependencias:
```bash
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

### 2. Levantar PostgreSQL:
```bash
docker-compose up -d
```

### 3. Iniciar desarrollo (en 2 terminales):
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm start
```

### 4. Acceder:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001
- Base de datos: localhost:5432

## 🔐 Autenticación

- **JWT** guardado en localStorage
- **Interceptor Axios** agrega token automáticamente
- Logout automático en 401
- Rutas protegidas con ProtectedRoute

## 📚 API Endpoints (Fase 1)

### Auth
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Perfil actual (requiere auth)

### Dashboard
- `GET /api/dashboard/stats` - Estadísticas (requiere auth)

## 🎯 Fases de Desarrollo

### Fase 1 ✅ (ACTUAL)
- [x] Autenticación (login/register)
- [x] Dashboard con KPIs
- [x] Gráficos básicos
- [x] Sidebar navegación

### Fase 2 (Próxima)
- Gestión de citas
- Calendario visual
- Validación de conflictos

### Fase 3
- Gestión de clientes
- Historial de citas
- Búsqueda avanzada

### Fase 4
- Catálogo de servicios
- Reportes PDF/Excel
- Analytics avanzados

## 🛠️ Comandos Útiles

### Backend
```bash
npm run dev      # Desarrollo con hot reload
npm run build    # Compilar TypeScript
npm run start    # Ejecutar producción
npm test         # Tests
```

### Frontend
```bash
npm run dev      # Desarrollo con hot reload
npm run build    # Build para producción
npm run preview  # Preview del build
```

### Docker
```bash
docker-compose up -d     # Levantar BD
docker-compose down      # Apagar BD
docker-compose down -v   # Apagar y eliminar datos
docker ps                # Ver contenedores
```

## 📝 Convenciones de Código

- **TypeScript**: Tipos estrictos siempre
- **Componentes**: Functional components + hooks
- **Estilos**: Tailwind CSS (no componentes styled)
- **API**: Axios client centralizado
- **Estado**: Zustand para auth, React Query para datos
- **Errores**: Manejo con try/catch en async/await

## 🔑 Variables de Entorno

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@host:5432/db
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env.local)
```
VITE_API_URL=http://localhost:3001/api
```

## 🚨 Notas Importantes

1. **Base de datos**: Se crea automáticamente al iniciar backend
2. **Credenciales demo**: Crea un usuario nuevo al registrarte
3. **Token expira en 7 días**: Configurable en .env
4. **CORS**: Permitido solo localhost en desarrollo
5. **Hot reload**: Backend (tsx) y Frontend (Vite) con hot reload activado

## 📱 Responsivo

- Mobile-first con Tailwind
- Sidebar colapsable en móvil
- Gráficos responsive con Recharts
- Touch-friendly buttons

## 🔍 Debugging

- **Backend**: Logs en console
- **Frontend**: React DevTools + Vite debug
- **BD**: `docker exec urban-ladies-db psql -U urban_user -d urban_ladies_db`

## 🤝 Colaboración

- Commits pequeños y descriptivos
- Rama `main` siempre estable
- PRs antes de merge en producción
- Tests antes de deploy

## 📞 Contacto

Cualquier duda sobre la arquitectura o implementación, avisar.

---

**Última actualización**: 2026-05-23
