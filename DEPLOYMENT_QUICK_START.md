# ⚡ Guía Rápida de Despliegue (10 minutos)

## Resumen visual

```
Tu Código GitHub
      ↓
   ├─→ Vercel (Frontend) → https://tu-salon.vercel.app
   │
   └─→ Railway (Backend + BD) → https://backend.railway.app
```

---

## 🎯 Pasos Principales (SIN código)

### 1️⃣ GitHub (5 min)
- [ ] Crear cuenta en https://github.com
- [ ] Crear repo nuevo
- [ ] Seguir instrucciones para subir código local
  ```
  git init
  git add .
  git commit -m "initial"
  git remote add origin https://github.com/TU_USER/urban-ladies.git
  git push -u origin main
  ```

### 2️⃣ Railway Base de Datos (3 min)
- [ ] Crear cuenta https://railway.app
- [ ] Click "+ Create" → "Database" → "PostgreSQL"
- [ ] Copiar `DATABASE_URL` (guardar en Notepad)

### 3️⃣ Railway Backend (2 min)
- [ ] Click "+ Create" → "GitHub Repo"
- [ ] Seleccionar tu repo
- [ ] Ir a "Variables" y añadir:
  ```
  DATABASE_URL = [la que copiaste]
  JWT_SECRET = mi_clave_super_segura_123
  NODE_ENV = production
  CORS_ORIGIN = https://tu-salon.vercel.app [después]
  ```
- [ ] Copiar URL del deploy (guardar en Notepad)

### 4️⃣ Vercel Frontend (2 min)
- [ ] Crear cuenta https://vercel.com (con GitHub)
- [ ] Click "Add New" → "Project"
- [ ] Seleccionar repo
- [ ] Ir a "Settings" → "Environment Variables"
- [ ] Añadir:
  ```
  VITE_API_URL = https://[URL-de-railway]/api
  ```
- [ ] Redeploy (click en "..." → Redeploy)

### 5️⃣ Volver a Railway (1 min)
- [ ] En Backend Variables, cambiar:
  ```
  CORS_ORIGIN = https://[tu-salon].vercel.app
  ```
- [ ] Railway redeploya automáticamente

### ✅ Listo
Tu app está en: **https://tu-salon.vercel.app**

---

## 📱 Para que accedan tus empleadas

1. Abre la app
2. Intenta loguarte (no funciona aún porque no hay usuarios)
3. Crea usuarios en la BD:
   - Abre Railway → PostgreSQL → Connect
   - Ejecuta SQL para insertar usuarios
4. Comparte URL con tu equipo
5. Cada una se loguea con su usuario

---

## 📍 URLs a recordar

- **App** (compartir esto): https://tu-salon.vercel.app
- **GitHub** (código): https://github.com/tu-usuario/urban-ladies
- **Railway** (servidor): https://railway.app (tu dashboard)
- **Vercel** (frontend): https://vercel.com (tu dashboard)

---

## 🆘 Si algo falla

| Problema | Solución |
|----------|----------|
| App en blanco | Revisa VITE_API_URL en Vercel |
| No carga datos | Revisa DATABASE_URL en Railway |
| Error CORS | Revisa CORS_ORIGIN en Railway |
| No puedo loguearme | Crea usuario en la BD |

---

✨ **¡Lo hiciste! Tu app está en el mundo** 🌍
