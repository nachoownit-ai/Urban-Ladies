# 👥 Crear Usuarios en la Base de Datos

Una vez que tu BD PostgreSQL esté en Railway, sigue estos pasos para crear usuarios.

---

## Opción 1: Railway Console (Más Fácil)

### Paso 1: Abrir consola PostgreSQL
1. Ve a https://railway.app
2. Click en tu proyecto
3. Click en **PostgreSQL**
4. Click en **"Connect"**
5. Copia el comando `psql` (verás algo como):
   ```
   PGPASSWORD=xxxxx psql -h containers.railway.app -U postgres -p 7811 -d railway
   ```

### Paso 2: Pegar en PowerShell
1. Abre PowerShell
2. Pega el comando
3. Presiona Enter
4. Deberías ver el prompt `railway=#`

### Paso 3: Crear tabla de usuarios (solo la primera vez)
Si aún no existe la tabla, ejecuta:

```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'employee',
  active INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Presiona Enter.

### Paso 4: Insertar primer usuario (Admin)
Copia y pega esto en PostgreSQL:

```sql
INSERT INTO users (id, email, password_hash, name, role, active) 
VALUES (
  'user-' || gen_random_uuid(),
  'admin@urbanladies.com',
  '$2a$10$dXJ3SW6G7P50eS3xNsCcxuNmdvHtQolqaS/tUUUgNA7ByVcQkS8h2',
  'Administrador',
  'admin',
  1
);
```

**Credenciales:**
- Email: `admin@urbanladies.com`
- Contraseña: `admin123`

Presiona Enter.

### Paso 5: Insertar más empleadas
Repite esto para cada empleada (cambia los valores):

```sql
INSERT INTO users (id, email, password_hash, name, role, active) 
VALUES (
  'user-' || gen_random_uuid(),
  'rubi@urbanladies.com',
  '$2a$10$dXJ3SW6G7P50eS3xNsCcxuNmdvHtQolqaS/tUUUgNA7ByVcQkS8h2',
  'Rubi',
  'employee',
  1
);
```

**Usuarios de ejemplo:**
```sql
-- Ángela
INSERT INTO users (id, email, password_hash, name, role, active) 
VALUES ('user-' || gen_random_uuid(), 'angela@urbanladies.com', '$2a$10$dXJ3SW6G7P50eS3xNsCcxuNmdvHtQolqaS/tUUUgNA7ByVcQkS8h2', 'Ángela', 'employee', 1);

-- Laura
INSERT INTO users (id, email, password_hash, name, role, active) 
VALUES ('user-' || gen_random_uuid(), 'laura@urbanladies.com', '$2a$10$dXJ3SW6G7P50eS3xNsCcxuNmdvHtQolqaS/tUUUgNA7ByVcQkS8h2', 'Laura', 'employee', 1);

-- Sofía
INSERT INTO users (id, email, password_hash, name, role, active) 
VALUES ('user-' || gen_random_uuid(), 'sofia@urbanladies.com', '$2a$10$dXJ3SW6G7P50eS3xNsCcxuNmdvHtQolqaS/tUUUgNA7ByVcQkS8h2', 'Sofía', 'employee', 1);
```

Presiona Enter después de cada una.

### Paso 6: Verificar que funcionó
```sql
SELECT email, name, role FROM users;
```

Deberías ver tus usuarios listados.

### Paso 7: Salir
```sql
\q
```

---

## Todas las contraseñas tienen hash: `$2a$10$dXJ3SW6G7P50eS3xNsCcxuNmdvHtQolqaS/tUUUgNA7ByVcQkS8h2`

**Esto corresponde a la contraseña: `admin123`**

---

## Opción 2: Generar tus propias contraseñas

Si quieres usar contraseñas diferentes para cada empleada:

### 1. En tu máquina, genera hashes:
```bash
cd "C:\Users\nacho\OneDrive\Documentos\Claude\Projects\Peluquería Urban Ladies"
npm install bcryptjs
node scripts/generate-password-hash.js mi_contraseña_secreta
```

Esto te dará un hash como:
```
$2a$10$abc123xyz...
```

### 2. Usa ese hash en tu INSERT:
```sql
INSERT INTO users (id, email, password_hash, name, role, active) 
VALUES (
  'user-' || gen_random_uuid(),
  'empleada@urbanladies.com',
  '$2a$10$abc123xyz...',  -- El hash que generaste
  'Nombre Empleada',
  'employee',
  1
);
```

---

## ✅ Checklist Final

- [ ] Creé tabla de usuarios
- [ ] Creé usuario admin
- [ ] Creé usuarios para cada empleada
- [ ] Probé loguearme en la app
- [ ] Compartí URL con mi equipo

---

## 🧪 Probar la app

1. Ve a `https://tu-salon.vercel.app`
2. Haz clic en "Configuración" (arriba a la derecha)
3. Debería cargar sin errores
4. Intenta loguarte:
   - Email: admin@urbanladies.com
   - Contraseña: admin123

¡Si funciona, ¡lo lograste! 🎉

---

## 🆘 Problemas

**Error: "usuario ya existe"**
- El usuario ya está en la BD. Intenta otro email.

**Error: "psql: command not found"**
- Necesitas instalar PostgreSQL CLI. Descarga desde https://www.postgresql.org/download/

**No puedo conectarme a la BD**
- Verifica que estés copiando el comando completo de Railway
- Asegúrate de tener internet

**Olvidé la contraseña de una empleada**
- Puedes resetearla actualizando el hash:
  ```sql
  UPDATE users SET password_hash = '$2a$10$dXJ3SW6G7P50eS3xNsCcxuNmdvHtQolqaS/tUUUgNA7ByVcQkS8h2' 
  WHERE email = 'empleada@urbanladies.com';
  ```
  Ahora su contraseña es `admin123` nuevamente.

---

¡Listo! Ya tienes usuarios en tu BD 🎉
