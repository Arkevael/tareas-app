import { useEffect, useState } from "react";
import Formulario from "./components/Formulario.jsx";
import ListaTareas from "./components/ListaTareas.jsx";

// URL de la API: en producción viene de VITE_API_URL; en local usa localhost
const API = import.meta.env.VITE_API_URL || "http://localhost:3001/api/tareas";

export default function App() {
  const [tareas, setTareas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Se ejecuta UNA vez al cargar la página
  useEffect(() => {
    cargarTareas();
  }, []);

  async function cargarTareas() {
    try {
      const res = await fetch(API);
      if (!res.ok) throw new Error("No se pudieron cargar las tareas");
      setTareas(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  async function agregarTarea(titulo) {
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo }),
      });
      if (!res.ok) throw new Error("No se pudo crear la tarea");
      const nueva = await res.json();
      setTareas([...tareas, nueva]); // inmutable: copia + nuevo
    } catch (err) {
      setError(err.message);
    }
  }

  async function eliminarTarea(id) {
    try {
      const res = await fetch(`${API}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("No se pudo eliminar la tarea");
      setTareas(tareas.filter((t) => t.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  async function toggleTarea(id) {
    try {
      const tarea = tareas.find((t) => t.id === id);
      const res = await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completada: !tarea.completada }),
      });
      if (!res.ok) throw new Error("No se pudo actualizar la tarea");
      const actualizada = await res.json();
      setTareas(tareas.map((t) => (t.id === id ? actualizada : t)));
    } catch (err) {
      setError(err.message);
    }
  }

  // Reto: editar el título (doble clic en la tarea → PUT)
  async function editarTarea(id, titulo) {
    try {
      const res = await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo }),
      });
      if (!res.ok) throw new Error("No se pudo editar la tarea");
      const actualizada = await res.json();
      setTareas(tareas.map((t) => (t.id === id ? actualizada : t)));
    } catch (err) {
      setError(err.message);
    }
  }

  // Reto: eliminar todas las completadas (varios DELETE seguidos)
  async function eliminarCompletadas() {
    try {
      const completadas = tareas.filter((t) => t.completada);
      const respuestas = await Promise.all(
        completadas.map((t) => fetch(`${API}/${t.id}`, { method: "DELETE" }))
      );
      if (respuestas.some((r) => !r.ok)) throw new Error("No se pudieron eliminar todas las completadas");
      setTareas(tareas.filter((t) => !t.completada));
    } catch (err) {
      setError(err.message);
    }
  }

  // Reto: contador "X de Y tareas completadas"
  const totalCompletadas = tareas.filter((t) => t.completada).length;

  if (cargando) return <p className="estado">Cargando...</p>;
  if (error) return <p className="estado">❌ {error}</p>;

  return (
    <main className="contenedor">
      <h1>✅ Mis tareas</h1>
      <Formulario onAgregar={agregarTarea} />
      <ListaTareas
        tareas={tareas}
        onEliminar={eliminarTarea}
        onToggle={toggleTarea}
        onEditar={editarTarea}
      />
      {tareas.length > 0 && (
        <footer className="resumen">
          <span>{totalCompletadas} de {tareas.length} tareas completadas</span>
          {totalCompletadas > 0 && (
            <button onClick={eliminarCompletadas} className="btn-limpiar">
              Eliminar completadas
            </button>
          )}
        </footer>
      )}
    </main>
  );
}
