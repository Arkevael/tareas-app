const express = require("express");
const cors = require("cors");

const app = express();

// CORS dinámico: en desarrollo acepta cualquier origen ("*");
// en producción se restringe con la variable CLIENTE_URL (URL de Vercel, sin "/" final)
app.use(cors({ origin: process.env.CLIENTE_URL || "*" }));

// Permite leer el cuerpo JSON de las peticiones (req.body). Va antes de las rutas
app.use(express.json());

// Datos en memoria (luego los cambiamos por una base de datos)
let tareas = [
  { id: 1, titulo: "Aprender React", completada: false },
  { id: 2, titulo: "Conectar con Node.js", completada: false },
];
let siguienteId = 3;

// GET - Obtener todas las tareas
app.get("/api/tareas", (req, res) => {
  res.json(tareas);
});

// POST - Crear una tarea
app.post("/api/tareas", (req, res) => {
  const { titulo } = req.body || {};

  // El servidor siempre valida, aunque el frontend también lo haga
  if (typeof titulo !== "string" || !titulo.trim()) {
    return res.status(400).json({ error: "El titulo es obligatorio" });
  }

  const nueva = { id: siguienteId++, titulo: titulo.trim(), completada: false };
  tareas.push(nueva);
  res.status(201).json(nueva);
});

// PUT - Completar / descompletar y/o editar el título
app.put("/api/tareas/:id", (req, res) => {
  const tarea = tareas.find((t) => t.id === Number(req.params.id));
  if (!tarea) return res.status(404).json({ error: "Tarea no encontrada" });

  const { titulo, completada } = req.body || {};

  // Edición de título (reto): se valida igual que en el POST
  if (titulo !== undefined) {
    if (typeof titulo !== "string" || !titulo.trim()) {
      return res.status(400).json({ error: "El titulo es obligatorio" });
    }
    tarea.titulo = titulo.trim();
  }

  // Si llega "completada" se usa ese valor; si no llegó nada, se invierte el actual
  if (completada !== undefined) {
    tarea.completada = Boolean(completada);
  } else if (titulo === undefined) {
    tarea.completada = !tarea.completada;
  }

  res.json(tarea);
});

// DELETE - Eliminar
app.delete("/api/tareas/:id", (req, res) => {
  const id = Number(req.params.id);
  const existe = tareas.some((t) => t.id === id);
  if (!existe) return res.status(404).json({ error: "Tarea no encontrada" });

  tareas = tareas.filter((t) => t.id !== id);
  res.status(204).send();
});

// Render asigna el puerto mediante la variable de entorno PORT
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API en el puerto ${PORT}`));
