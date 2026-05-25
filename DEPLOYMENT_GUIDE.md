# 🚀 Guía Completa de Despliegue - Urban Ladies PRO

Sigue estos pasos para desplegar tu aplicación en internet para que múltiples personas la usen.

---

## **PASO 1: Crear cuenta en GitHub y subir el código**

### 1.1 Crear repositorio en GitHub
1. Ve a https://github.com/new
2. Nombre: `urban-ladies-pro`
3. Descripción: `Sistema de gestión para salones de belleza`
4. Privado o Público (como prefieras)
5. Click en "Create repository"

### 1.2 Subir el código a GitHub
En PowerShell, en la carpeta del proyecto:

```powershell
git init
git add .
git commit -m "Initial commit: Urban Ladies PRO"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/urban-ladies-pro.git
git push -u origin main
```

**Nota:** Reemplaza `TU_USUARIO` con tu usuario de GitHub

---

## **PASO 2: Crear Base de Datos PostgreSQL (Railway)**

### 2.1 Crear cuenta en Railway
1. Ve a https://railway.app
2. Haz click en "Get Started"
3. Loguéate con GitHub (es lo más fácil)
4. Click en "Create New Project"

### 2.2 Agregar PostgreSQL
1. En Railway, click en "+ Create"
2. Selecciona "Database" → "PostgreSQL"
3. Railway crea automáticamente una BD
4. Espera 1-2 minutos a que esté lista

### 2.3 Obtener credenciales
1. Click en "PostgreSQL" en tu proyecto
2. Copia la variable `DATABASE_URL`
3. Guárdala en un lugar seguro (la necesitarás después)

**Ejemplo:**
```
postgresql://postgres:abc123@containers.railway.app:7811/railway
```

---

## **PASO 3: Desplegar Backend (Railway)**

### 3.1 Conectar repositorio
1. En Railway, click en "+ Create"
2. Selecciona "GitHub Repo"
3. Autoriza a Railway a acceder a GitHub
4. Selecciona `urban-ladies-pro`
5. Click en "Deploy"

### 3.2 Configurar variables de entorno
1. En Railway, ve a tu proyecto
2. Click en "Variables"
3. Añade estas variables:

```
DATABASE_URL = [LA QUE COPIASTE DE PostgreSQL]
JWT_SECRET = mi_clave_super_secreta_12345_cambiar_esto
JWT_EXPIRES_IN = 7d
NODE_ENV = production
CORS_ORIGIN = https://tu-salon.vercel.app
PORT = 3001
```

### 3.3 Obtener URL del backend
1. En Railway, va a "Deployments"
2. Busca la URL como: `https://urban-ladies-pro-production.up.railway.app`
3. Guárdala, la necesitarás en el paso siguiente

---

## **PASO 4: Desplegar Frontend (Vercel)**

### 4.1 Crear cuenta en Vercel
1. Ve a https://vercel.com/signup
2. Loguéate con GitHub (es lo más fácil)

### 4.2 Desplegar proyecto
1. Click en "Add New..." → "Project"
2. Importa tu repositorio `urban-ladies-pro`
3. Vercel detecta automáticamente que es Vite
4. No necesitas cambiar configuración, click en "Deploy"

### 4.3 Configurar variables de entorno
1. En Vercel, ve a "Settings" → "Environment Variables"
2. Añade esta variable:

```
VITE_API_URL = https://urban-ladies-pro-production.up.railway.app/api
```

(Reemplaza con la URL real de tu backend de Railway)

### 4.4 Redeploy
1. Después de añadir la variable, click en "Deployments"
2. Haz click en los 3 puntos del deployment más reciente
3. Click en "Redeploy"
4. Espera a que termine (1-2 minutos)

### 4.5 Obtener URL de tu app
- Tu app estará en algo como: `https://urban-ladies-pro.vercel.app`
- **Esta es la URL que compartirás con tus empleadas**

---

## **PASO 5: Actualizar CORS en Backend**

1. En Railway, en "Variables" del backend:
   - Cambia `CORS_ORIGIN` a tu URL de Vercel
   - Por ejemplo: `https://urban-ladies-pro.vercel.app`
2. Railway redeploya automáticamente

---

## **PASO 6: Crear primer usuario en la BD**

Ahora necesitamos crear un usuario en la BD para que puedas loguarte.

### Opción A: Usar Railway Console (Más fácil)

1. En Railway, ve a PostgreSQL
2. Click en "Connect" → "Command Line"
3. Copia el comando y ejecútalo en PowerShell
4. En psql, ejecuta:

```sql
INSERT INTO users (id, email, password_hash, name, role, active)
VALUES (
  'user123',
  'admin@urbanladies.com',
  '$2a$10$abc...',  -- hash bcrypt de "123456"
  'Admin',
  'admin',
  1
);
```

### Opción B: Usar un script SQL

Crea un archivo `init.sql` en tu proyecto:

```sql
INSERT INTO users (id, email, password_hash, name, role, active)
VALUES (
  gen_random_uuid(),
  'admin@urbanladies.com',
  -- hash bcrypt de "admin123"
  '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lm',
  'Admin Urban Ladies',
  'admin',
  1
);
```

---

## **PASO 7: Probar todo**

1. Ve a `https://tu-salon.vercel.app`
2. Debería cargar la aplicación
3. Haz clic en "Configuración" para verificar que la BD está funcionando
4. Intenta loguarte con:
   - Email: `admin@urbanladies.com`
   - Contraseña: `admin123`

---

## **PASO 8: Compartir con tu equipo**

1. Crea cuentas para tus empleadas en la BD (igual que el paso 6)
2. Comparte la URL: `https://tu-salon.vercel.app`
3. Cada una se loguea con sus credenciales
4. ¡Listo! Pueden acceder desde cualquier dispositivo/navegador

---

## **Notas Importantes**

### ⚠️ Cambiar contraseña JWT
En Railway → Backend → Variables, cambia:
```
JWT_SECRET = [Genera una cadena larga y segura]
```

### 📱 Acceso desde móvil
- La URL funciona igual en teléfono
- Recomendado: crear un acceso directo en la pantalla de inicio

### 🔄 Actualizaciones futuras
Cada vez que hagas cambios:
1. `git push` a GitHub
2. Vercel y Railway redeplogan automáticamente

### 💾 Backups de BD
Railway mantiene backups automáticos. Ve a PostgreSQL → Backups

### 🔐 Seguridad
- Cambia `JWT_SECRET` a algo muy seguro
- Usa contraseñas fuertes para tus empleadas
- No compartas variables de entorno públicamente

---

## **Costos Estimados**

| Servicio | Costo |
|----------|-------|
| Railway (Backend + BD) | Gratis primeros $5, luego ~$5-10/mes |
| Vercel (Frontend) | Gratis |
| **Total** | **~$5-10/mes** |

---

## **¿Problemas?**

Si algo no funciona:

1. **App en blanco**: Verifica VITE_API_URL en Vercel
2. **No puedo loguearme**: Verifica que el usuario está en la BD
3. **Error CORS**: Verifica CORS_ORIGIN en Railway
4. **BD no responde**: Reinicia PostgreSQL en Railway

---

¡Listo! Tu aplicación está en el mundo 🌍
