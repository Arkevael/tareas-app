# ✅ Tareas App — React + Node.js

Aplicación web full-stack para gestionar tareas (crear, completar y eliminar).
Desarrollada para la **Guía 8 — Aplicaciones Web Full-Stack con React + Node.js** del curso *Plataformas para el Desarrollo de Aplicaciones* (Ingeniería de Sistemas, 2026-II).

| Parte | Tecnología | Puerto local | Despliegue |
|---|---|---|---|
| Frontend (`client/`) | React 18 + Vite | 5173 | Vercel |
| Backend (`server/`) | Node.js + Express + CORS | 3001 | Render |

> **Nota:** las tareas se guardan **en memoria (RAM)**. Al reiniciar el servidor se pierden; es el comportamiento esperado en esta etapa (el siguiente paso sería MongoDB o PostgreSQL).

## 🌐 URLs en vivo (reemplaza con las tuyas)

- Frontend: `https://tareas-app.vercel.app`
- API: `https://tareas-api.onrender.com/api/tareas`
- Repositorio: `https://github.com/tu-usuario/tareas-app`

## 📸 Capturas (placeholders)

- `[CAPTURA 1]` App en vivo con tareas creadas
- `[CAPTURA 2]` Panel de Render (servicio `tareas-api` en estado *Live*)
- `[CAPTURA 3]` Panel de Vercel (deployment *Ready*)
- `[CAPTURA 4]` F12 → Network mostrando el `POST /api/tareas`

## 📁 Estructura

```
tareas-app/
├── server/                 # Backend (Node + Express)
│   ├── index.js            # API REST (4 endpoints)
│   ├── package.json
│   └── .env.example
├── client/                 # Frontend (React + Vite)
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   ├── .env.example
│   └── src/
│       ├── main.jsx
│       ├── App.jsx         # Estado + comunicación con la API
│       ├── App.css
│       └── components/     # Formulario, ListaTareas, Tarea
├── render.yaml             # Blueprint del backend en Render
├── vercel.json             # Configuración del frontend en Vercel
├── empaquetar.sh           # Genera tareas-app.rar (o .zip)
├── .gitignore
└── README.md
```

## 📋 Requisitos

- **Node.js 18 o superior** (verifica con `node -v`). Incluye `npm`.
- Git y una cuenta de GitHub (para desplegar).
- Cuentas gratuitas en [Render](https://render.com) y [Vercel](https://vercel.com).

## 💻 Instalación y ejecución local (dos terminales)

Son dos programas independientes: Node ocupa el puerto 3001 y Vite el 5173.

**Terminal 1 — Backend**

```bash
cd server
npm install
npm run dev        # node --watch index.js → http://localhost:3001
```

**Terminal 2 — Frontend**

```bash
cd client
npm install
npm run dev        # Vite → http://localhost:5173
```

Abre <http://localhost:5173> y prueba crear, completar (clic en el texto) y eliminar tareas.

Variables de entorno **opcionales** en local: copia `server/.env.example` y `client/.env.example` como `.env` si quieres cambiarlas. Sin `.env`, la app usa `http://localhost:3001/api/tareas` y CORS abierto (`*`).

> El servidor lee `process.env` directamente (no usa `dotenv`). En local, para probar CORS restringido: `CLIENTE_URL=http://localhost:5173 npm run dev` (Linux/macOS) o `$env:CLIENTE_URL="http://localhost:5173"; npm run dev` (PowerShell).

## 🧪 Probar la API con curl

```bash
# Listar tareas
curl http://localhost:3001/api/tareas

# Crear una tarea (201) — con título vacío responde 400
curl -X POST http://localhost:3001/api/tareas \
  -H "Content-Type: application/json" \
  -d '{"titulo":"Estudiar para el examen"}'

# Completar la tarea 1 (404 si no existe)
curl -X PUT http://localhost:3001/api/tareas/1 \
  -H "Content-Type: application/json" \
  -d '{"completada":true}'

# Eliminar la tarea 2 (204, o 404 si no existe)
curl -X DELETE http://localhost:3001/api/tareas/2
```

| Verbo | Ruta | Acción | Respuestas |
|---|---|---|---|
| GET | `/api/tareas` | Lista todas | 200 |
| POST | `/api/tareas` | Crea una | 201 / 400 |
| PUT | `/api/tareas/:id` | Completa / descompleta | 200 / 404 |
| DELETE | `/api/tareas/:id` | Elimina | 204 / 404 |

## 🚀 Despliegue

Son **dos despliegues**: backend en Render y frontend en Vercel. Primero sube el código a GitHub:

```bash
git init
git add .
git commit -m "feat: tareas-app inicial"
git branch -M main
git remote add origin https://github.com/tu-usuario/tareas-app.git
git push -u origin main
```

### 1) Backend en Render

1. Entra a [render.com](https://render.com) e inicia sesión con GitHub.
2. **New → Web Service** y conecta el repositorio `tareas-app`.
3. Configura:

   | Campo | Valor |
   |---|---|
   | Name | `tareas-api` |
   | Root Directory | `server` |
   | Build Command | `npm install` |
   | Start Command | `node index.js` |
   | Instance Type | Free |

4. En **Environment Variables** agrega `CLIENTE_URL` = `*` (temporal; se restringe abajo).
5. **Deploy** y espera 2–5 minutos.
6. Abre `https://tareas-api.onrender.com/api/tareas`: debes ver el JSON.

Alternativa: **New → Blueprint** y selecciona el repo; Render lee `render.yaml`.

> El plan Free "duerme" tras 15 min sin uso y tarda ~1 min en despertar en la primera petición.

### 2) Frontend en Vercel

1. Entra a [vercel.com](https://vercel.com) con GitHub → **Add New → Project**.
2. Importa el repositorio `tareas-app`.
3. Pulsa **Edit** junto a *Root Directory* y elige **`client`**. Vercel detecta Vite.
4. Configura:

   | Campo | Valor |
   |---|---|
   | Build Command | `npm run build` |
   | Output Directory | `dist` |
   | Environment Variable | `VITE_API_URL` = `https://tareas-api.onrender.com/api/tareas` |

5. **Deploy**; en ~1 minuto tendrás `https://tareas-app.vercel.app`.

> **Sobre `vercel.json`:** el de la raíz solo se usa si dejas *Root Directory* en la raíz del repo (compila con `cd client && …` y publica `client/dist`). Si eliges Root Directory = `client`, Vercel ignora ese archivo y usa los valores de la tabla. Las variables de entorno (`VITE_API_URL`) siempre se definen en el panel de Vercel.

## 🔒 Restringir CORS después del despliegue

Cuando todo funcione:

1. Render → tu servicio `tareas-api` → **Environment**.
2. Edita `CLIENTE_URL` y pon la URL real de Vercel, **sin "/" final**: `https://tareas-app.vercel.app`.
3. Guarda: Render redespliega solo. Ahora solo tu frontend puede consumir la API.

El backend lo aplica con una línea: `app.use(cors({ origin: process.env.CLIENTE_URL || "*" }))`.
Nunca dejes `*` en la versión final de producción. Si tienes varios dominios (p. ej. previews de Vercel), CORS bloqueará los no listados.

## 🛠 Errores comunes y soluciones

| Error / síntoma | Causa probable | Solución |
|---|---|---|
| `CORS blocked` / `Access-Control-Allow-Origin` | El backend no autoriza el origen del frontend | Revisa `CLIENTE_URL`: debe coincidir exacto con la URL del frontend, sin `/` final |
| `Cannot GET /api/tareas` | Ruta mal escrita o servidor no reiniciado | Revisa la ruta; usa `npm run dev` (reinicio automático) |
| `fetch failed` / `ERR_CONNECTION_REFUSED` | Backend apagado o URL/puerto incorrectos | Mira la terminal del server y prueba con `curl` |
| `EADDRINUSE: 3001` | Otro proceso usa el puerto | `npx kill-port 3001` o cambia `PORT` |
| `req.body` es `undefined` | Falta `express.json()` | Debe ir antes de las rutas, una sola vez |
| Las tareas desaparecen | Datos en RAM | Esperado; la solución real es una base de datos |
| `VITE_API_URL` "no funciona" | Vite la lee solo al compilar | Cámbiala en Vercel y haz *redeploy*; en local reinicia `npm run dev` |
| Primera carga muy lenta en producción | Render Free estaba dormido | Espera ~1 min y recarga |

**Orden de depuración:** (1) ¿la API responde con `curl`? → (2) ¿el JSON es correcto? → (3) ¿la URL del frontend apunta al lugar correcto? → (4) ¿la consola del navegador muestra errores de CORS?

## 📦 Empaquetar

Desde la carpeta que contiene `tareas-app/`:

```bash
bash tareas-app/empaquetar.sh
```

Genera `tareas-app.rar` (o `tareas-app.zip` si `rar` no está instalado), excluyendo `node_modules`, `dist` y `.env` reales.

## ✅ Checklist final

- [ ] `node -v` ≥ 18 y la app funciona en local con dos terminales
- [ ] `curl http://localhost:3001/api/tareas` devuelve JSON
- [ ] El código está en GitHub (rama `main`) con commits descriptivos
- [ ] No hay `.env` ni credenciales en ningún commit
- [ ] Backend desplegado en Render (Root `server`, Free) y respondiendo
- [ ] Frontend desplegado en Vercel (Root `client`, `VITE_API_URL` definida)
- [ ] CRUD probado en producción (crear, leer, completar, eliminar)
- [ ] `CLIENTE_URL` en Render restringida a la URL de Vercel
- [ ] README con URLs en vivo y capturas

## 🎯 Retos de la guía

| Reto | Estado | Cómo se usa |
|---|---|---|
| 🥉 Contador "3 de 5 tareas completadas" | ✅ Hecho | Aparece al pie de la lista |
| 🥈 Botón "Eliminar completadas" | ✅ Hecho | Aparece cuando hay al menos una completada; lanza varios `DELETE` seguidos |
| 🥇 Editar título (doble clic → input → PUT) | ✅ Hecho | Doble clic en el texto; **Enter** o salir del campo guarda, **Esc** cancela |
| 🏆 Persistencia con MongoDB Atlas | ⏳ Pendiente | Requiere cuenta y cadena de conexión propias (ver pregunta 4) |

El `PUT /api/tareas/:id` acepta ahora `{ "completada": true }`, `{ "titulo": "Nuevo" }` o ambos. Con un título vacío responde 400.

```bash
curl -X PUT http://localhost:3001/api/tareas/1 \
  -H "Content-Type: application/json" \
  -d '{"titulo":"Aprender React 18"}'
```

## 💬 Preguntas para la próxima sesión

**1. ¿Qué diferencia hay entre guardar datos "en memoria" y "en disco"?**
La memoria (RAM) es muy rápida y no requiere configuración, pero es volátil: los datos se pierden al reiniciar o redesplegar el servidor. Y no se comparte entre varias instancias. El disco (archivo o base de datos) es más lento pero persistente, permite consultas, respaldos y concurrencia. Con la RAM ganas velocidad y simplicidad; con el disco ganas durabilidad y fiabilidad.

**2. ¿Por qué el navegador implementa CORS? ¿Qué ataque previene?**
Se apoya en la *política del mismo origen*: sin ella, una página maliciosa abierta en otra pestaña podría hacer peticiones a tu banco o a tu correo usando las cookies y sesiones que el navegador ya tiene, y leer las respuestas. Esto es lo que previene (ataques tipo CSRF y robo de datos entre sitios). CORS es la forma controlada de que un servidor autorice explícitamente qué otros orígenes pueden leer sus respuestas. Importante: protege al usuario en el navegador; no sustituye la autenticación del servidor, porque `curl` o Postman no aplican CORS.

**3. Si la API en Render "se duerme" tras 15 minutos, ¿cómo mitigarlo?**
- Un *ping* periódico (UptimeRobot, cron-job.org o GitHub Actions) a un endpoint ligero, por ejemplo cada 10 minutos (respetando las condiciones de uso de la plataforma).
- Pasar a un plan de pago que mantenga el servicio siempre activo.
- Mostrar en el frontend un mensaje de "Despertando el servidor…" para mejorar la experiencia.
- Migrar a una plataforma sin apagado por inactividad o a un VPS.

**4. ¿Qué cambiar en `server/index.js` para que las tareas sobrevivan a un reinicio?**
Reemplazar el arreglo `tareas` por una base de datos (por ejemplo MongoDB Atlas con Mongoose):

1. Instalar el driver (`npm install mongoose`) y guardar la cadena de conexión en una variable de entorno (`MONGODB_URI`), nunca en el repositorio.
2. Conectar al arrancar (`mongoose.connect(process.env.MONGODB_URI)`) y definir un modelo `Tarea` con `titulo` y `completada`.
3. Convertir cada endpoint en asíncrono:
   - GET → `await Tarea.find()`
   - POST → `await Tarea.create({ titulo })`
   - PUT → `await Tarea.findByIdAndUpdate(id, cambios, { new: true })`
   - DELETE → `await Tarea.findByIdAndDelete(id)`
4. Usar `try/catch` y responder 500 si falla la base de datos.
5. Considerar que el `id` pasa a ser un `_id` de texto (ya no un número), y que el frontend debe usarlo igual en `key` y en las URLs.

Flujo: React → API (Express) → base de datos (disco) → API → React. Así los datos sobreviven aunque Render reinicie el servicio.

## 📄 Licencia

Proyecto académico — uso educativo.
