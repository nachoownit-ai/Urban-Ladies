# 📱 Urban Ladies PRO - Guía de Integración N8N
**Versión**: 1.0  
**Fecha**: 2026-06-01  
**Estado**: ✅ Backend Desplegado en Railway

---

## 🔗 URLs y Acceso

### Frontend (App para Usuarios)
```
https://urban-ladies-crm.netlify.app/
```
- Aplicación web para gestionar citas
- React 18 + Tailwind CSS
- Datos sincronizados con Supabase en tiempo real

### Backend API (Para N8N)
```
https://urban-ladies-production.up.railway.app
```
- Express.js + TypeScript
- API REST para N8N
- Conectado a Supabase PostgreSQL

### Base de Datos
```
Supabase PostgreSQL
URL: https://gmanikbgtvoghtzxxioq.supabase.co
```
- Almacenamiento persistente de citas
- Acceso controlado mediante API
- Tabla: `appointments`

---

## 🛠️ Tools N8N - Endpoints Disponibles

### 📌 TOOL 1: Verificar Disponibilidad

**Tipo**: GET  
**URL**:
```
https://urban-ladies-production.up.railway.app/api/n8n/check-availability
```

**Parámetros (Query String)**:
| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `service` | string | ✅ | Nombre del servicio (ej: "Corte", "Tinte", "Peinado") |
| `date` | string | ✅ | Fecha en formato YYYY-MM-DD (ej: "2026-06-05") |
| `start_time` | string | ✅ | Hora inicio en formato HH:mm (ej: "10:00") |
| `end_time` | string | ✅ | Hora final en formato HH:mm (ej: "10:45") |
| `professional` | string | ❌ | Nombre de la profesional (ej: "Rubi") - opcional |

**Ejemplo de Request**:
```
GET https://urban-ladies-production.up.railway.app/api/n8n/check-availability?service=Corte&date=2026-06-05&start_time=10:00&end_time=10:45&professional=Rubi
```

**Response (Disponible)**:
```json
{
  "success": true,
  "available": true,
  "message": "Disponible: Corte el 2026-06-05 de 10:00 a 10:45",
  "data": {
    "service": "Corte",
    "date": "2026-06-05",
    "start_time": "10:00",
    "end_time": "10:45",
    "professional": "Rubi",
    "available": true,
    "conflicts": 0
  }
}
```

**Response (No Disponible)**:
```json
{
  "success": true,
  "available": false,
  "message": "No disponible: conflicto de horario para Corte el 2026-06-05",
  "data": {
    "service": "Corte",
    "date": "2026-06-05",
    "start_time": "10:00",
    "end_time": "10:45",
    "professional": "Rubi",
    "available": false,
    "conflicts": 1
  }
}
```

---

### 📌 TOOL 2: Crear Cita

**Tipo**: POST  
**URL**:
```
https://urban-ladies-production.up.railway.app/api/n8n/create-appointment
```

**Headers**:
```
Content-Type: application/json
```

**Body (JSON)**:
| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `name` | string | ✅ | Nombre del cliente |
| `last_name` | string | ✅ | Apellido del cliente |
| `phone` | string | ✅ | Teléfono del cliente (con país, ej: "+34612345678") |
| `service` | string | ✅ | Tipo de servicio |
| `appointment_date` | string | ✅ | Fecha en YYYY-MM-DD |
| `start_time` | string | ✅ | Hora inicio HH:mm |
| `end_time` | string | ✅ | Hora final HH:mm |
| `professional` | string | ❌ | Nombre de profesional (opcional) |
| `notes` | string | ❌ | Notas adicionales (opcional) |

**Ejemplo de Request**:
```bash
curl -X POST https://urban-ladies-production.up.railway.app/api/n8n/create-appointment \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Isabel",
    "last_name": "Michoa",
    "phone": "+34612345678",
    "service": "Corte de Cabello",
    "appointment_date": "2026-06-05",
    "start_time": "10:00",
    "end_time": "10:45",
    "professional": "Rubi",
    "notes": "Cliente nueva, primera vez aquí"
  }'
```

**Response (Éxito - 201)**:
```json
{
  "success": true,
  "message": "Reserva creada exitosamente para Isabel Michoa",
  "data": {
    "appointment_id": "550e8400-e29b-41d4-a716-446655440000",
    "client_name": "Isabel Michoa",
    "phone": "+34612345678",
    "service": "Corte de Cabello",
    "date": "2026-06-05",
    "time": "10:00-10:45",
    "professional": "Rubi"
  }
}
```

**Response (Error - Conflicto de Horario)**:
```json
{
  "success": false,
  "message": "El horario 10:00-10:45 ya está reservado para Corte de Cabello el 2026-06-05"
}
```

**Response (Error - Campos Faltantes)**:
```json
{
  "success": false,
  "message": "Missing required fields: name, last_name, phone, service, appointment_date, start_time, end_time"
}
```

---

### 📌 TOOL 3: Cancelar Cita

**Tipo**: POST  
**URL**:
```
https://urban-ladies-production.up.railway.app/api/n8n/cancel-appointment
```

**Headers**:
```
Content-Type: application/json
```

**Body (JSON)**:
| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `name` | string | ✅ | Nombre del cliente |
| `last_name` | string | ✅ | Apellido del cliente |
| `phone` | string | ✅ | Teléfono del cliente |
| `appointment_date` | string | ✅ | Fecha en YYYY-MM-DD |
| `start_time` | string | ✅ | Hora inicio HH:mm |
| `end_time` | string | ✅ | Hora final HH:mm |

**Ejemplo de Request**:
```bash
curl -X POST https://urban-ladies-production.up.railway.app/api/n8n/cancel-appointment \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Isabel",
    "last_name": "Michoa",
    "phone": "+34612345678",
    "appointment_date": "2026-06-05",
    "start_time": "10:00",
    "end_time": "10:45"
  }'
```

**Response (Éxito)**:
```json
{
  "success": true,
  "message": "Reserva cancelada para Isabel Michoa",
  "data": {
    "appointment_id": "550e8400-e29b-41d4-a716-446655440000",
    "client_name": "Isabel Michoa",
    "phone": "+34612345678",
    "service": "Corte de Cabello",
    "date": "2026-06-05",
    "time": "10:00-10:45",
    "status": "cancelled"
  }
}
```

**Response (Error - Cita no encontrada)**:
```json
{
  "success": false,
  "message": "No se encontró cita para Isabel Michoa el 2026-06-05 de 10:00 a 10:45"
}
```

---

## 🚀 Cómo Crear las Tools en N8N

### Paso 1: Crear HTTP Node para "Verificar Disponibilidad"

1. **En tu workflow de N8N**, haz clic en **"+"** para agregar un nodo
2. Busca y selecciona **"HTTP Request"**
3. Configura los parámetros:

```
Nombre del nodo: "Check Availability"

Method: GET

URL: https://urban-ladies-production.up.railway.app/api/n8n/check-availability

Authentication: None

Query Parameters:
  ├─ service = {{ $node.VariableInput.json.service }}
  ├─ date = {{ $node.VariableInput.json.date }}
  ├─ start_time = {{ $node.VariableInput.json.start_time }}
  ├─ end_time = {{ $node.VariableInput.json.end_time }}
  └─ professional = {{ $node.VariableInput.json.professional }} (opcional)

Headers: (ninguno requerido)

Response: Success
  Expect success status code: 200-299
```

**Salida esperada**:
```json
{
  "success": true,
  "available": true,
  "message": "...",
  "data": { ... }
}
```

---

### Paso 2: Crear HTTP Node para "Crear Cita"

1. Haz clic en **"+"** y agrega otro nodo **"HTTP Request"**
2. Configura:

```
Nombre del nodo: "Create Appointment"

Method: POST

URL: https://urban-ladies-production.up.railway.app/api/n8n/create-appointment

Authentication: None

Headers:
  └─ Content-Type = application/json

Body:
{
  "name": "{{ $node.VariableInput.json.name }}",
  "last_name": "{{ $node.VariableInput.json.last_name }}",
  "phone": "{{ $node.VariableInput.json.phone }}",
  "service": "{{ $node.VariableInput.json.service }}",
  "appointment_date": "{{ $node.VariableInput.json.appointment_date }}",
  "start_time": "{{ $node.VariableInput.json.start_time }}",
  "end_time": "{{ $node.VariableInput.json.end_time }}",
  "professional": "{{ $node.VariableInput.json.professional }}",
  "notes": "{{ $node.VariableInput.json.notes }}"
}

Send Body: Body

Response: Success
  Expect success status code: 200-299
```

---

### Paso 3: Crear HTTP Node para "Cancelar Cita"

1. Haz clic en **"+"** y agrega otro nodo **"HTTP Request"**
2. Configura:

```
Nombre del nodo: "Cancel Appointment"

Method: POST

URL: https://urban-ladies-production.up.railway.app/api/n8n/cancel-appointment

Authentication: None

Headers:
  └─ Content-Type = application/json

Body:
{
  "name": "{{ $node.VariableInput.json.name }}",
  "last_name": "{{ $node.VariableInput.json.last_name }}",
  "phone": "{{ $node.VariableInput.json.phone }}",
  "appointment_date": "{{ $node.VariableInput.json.appointment_date }}",
  "start_time": "{{ $node.VariableInput.json.start_time }}",
  "end_time": "{{ $node.VariableInput.json.end_time }}"
}

Send Body: Body

Response: Success
  Expect success status code: 200-299
```

---

## 📋 Ejemplo Completo: Flujo de Reserva con IA

### Escenario
Un cliente llama para reservar una cita. El agente de N8N:
1. Recopila datos (nombre, fecha, hora, servicio)
2. Verifica disponibilidad
3. Si está disponible: crea la cita
4. Confirma con el cliente por teléfono

### Estructura del Workflow

```
Start
  │
  ├─→ [Input Variables Node] 
  │   Output: { name, last_name, phone, service, date, start_time, end_time, professional }
  │
  ├─→ [HTTP: Check Availability]
  │   GET /api/n8n/check-availability
  │
  ├─→ [Switch/IF] ¿Disponible?
  │   │
  │   ├─ YES
  │   │  │
  │   │  └─→ [HTTP: Create Appointment]
  │   │      POST /api/n8n/create-appointment
  │   │      │
  │   │      └─→ [OpenAI / IA Node]
  │   │          Generar mensaje: "Tu cita ha sido creada para..."
  │   │          │
  │   │          └─→ [Call API Node]
  │   │              Llamar cliente y hacer confirmación
  │   │              │
  │   │              └─→ [Log / End]
  │   │
  │   └─ NO
  │      │
  │      └─→ [OpenAI / IA Node]
  │          Generar mensaje: "Lo siento, ese horario no está disponible"
  │          │
  │          └─→ [Call API Node]
  │              Sugerir otros horarios
  │              │
  │              └─→ [Log / End]
```

---

## 🔄 Variables de Entorno Necesarias

**En N8N, crear credenciales**:

```
Nombre: Urban Ladies API
Tipo: Generic Credentials

Variables:
  ├─ BACKEND_URL = https://urban-ladies-production.up.railway.app
  ├─ APPOINTMENTS_API = /api/n8n
  └─ (Opcional) API_KEY = si quieres agregar autenticación luego
```

**Uso en nodes**:
```
{{ $credentials['Urban Ladies API'].BACKEND_URL }}{{ $credentials['Urban Ladies API'].APPOINTMENTS_API }}/check-availability
```

---

## ✅ Checklist de Implementación

- [ ] Creé HTTP Node para "Check Availability"
- [ ] Creé HTTP Node para "Create Appointment"
- [ ] Creé HTTP Node para "Cancel Appointment"
- [ ] Probé los 3 endpoints localmente (Postman/curl)
- [ ] Configuré variables de N8N correctamente
- [ ] Creé flujo de IA para generar mensajes personalizados
- [ ] Integré con tu API de llamadas
- [ ] Probé E2E: N8N llama → Cita se crea en BD → Confirmación en app

---

## 🐛 Troubleshooting

### Error: "CORS Error"
**Solución**: El backend está configurado para permitir solo:
- Frontend: `https://urban-ladies-crm.netlify.app`
- N8N: Debería estar permitido por defecto

Si N8N está en otro servidor, contacta para agregar su origen a CORS.

### Error: "Required fields missing"
**Solución**: Verifica que todos los campos requeridos estén presentes en el JSON:
- ✅ `name`, `last_name`, `phone` (siempre)
- ✅ `appointment_date`, `start_time`, `end_time` (siempre)
- ✅ `service` (siempre para crear)
- ❌ `professional` (opcional)

### Error: "Appointment not found"
**Solución**: Verifica que los datos coincidan exactamente:
- Nombre y apellido deben ser exactos
- Teléfono debe incluir código de país
- Fecha y hora deben estar en formato correcto

### Error: "Time conflict"
**Solución**: Otro cliente ya tiene cita en ese horario. Proponer otros horarios disponibles.

---

## 📞 Contacto y Soporte

**Backend**: https://urban-ladies-production.up.railway.app  
**Frontend**: https://urban-ladies-crm.netlify.app/  
**Base de datos**: Supabase (credenciales en backend .env)

Para problemas con la API, contactar al equipo de desarrollo.

---

**Documento generado**: 2026-06-01  
**Versión API**: v1.0  
**Estado**: ✅ Listo para Producción
