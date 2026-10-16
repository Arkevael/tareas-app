import { useState } from "react";

export default function Formulario({ onAgregar }) {
  const [titulo, setTitulo] = useState("");

  function manejarEnvio(e) {
    e.preventDefault(); // evita que la página se recargue
    if (!titulo.trim()) return; // no permitir tareas vacías
    onAgregar(titulo.trim());
    setTitulo("");
  }

  return (
    <form onSubmit={manejarEnvio} className="formulario">
      <input
        type="text"
        placeholder="Nueva tarea..."
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
      />
      <button type="submit">Agregar</button>
    </form>
  );
}
