import { useRef, useState } from "react";

export default function Tarea({ tarea, onEliminar, onToggle, onEditar }) {
  const [editando, setEditando] = useState(false);
  const [texto, setTexto] = useState(tarea.titulo);
  const temporizador = useRef(null);

  // El clic simple espera un instante: si llega un segundo clic (doble clic) se cancela el toggle
  function manejarClic() {
    clearTimeout(temporizador.current);
    temporizador.current = setTimeout(onToggle, 250);
  }

  function manejarDobleClic() {
    clearTimeout(temporizador.current);
    setTexto(tarea.titulo);
    setEditando(true);
  }

  function guardar() {
    const limpio = texto.trim();
    setEditando(false);
    // Solo se llama a la API si hay texto y realmente cambió
    if (limpio && limpio !== tarea.titulo) onEditar(limpio);
    else setTexto(tarea.titulo);
  }

  function cancelar() {
    setTexto(tarea.titulo);
    setEditando(false);
  }

  function manejarTecla(e) {
    if (e.key === "Enter") guardar();
    if (e.key === "Escape") cancelar();
  }

  return (
    <li className={tarea.completada ? "tarea completada" : "tarea"}>
      {editando ? (
        <input
          className="input-editar"
          autoFocus
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          onKeyDown={manejarTecla}
          onBlur={guardar}
        />
      ) : (
        <span
          onClick={manejarClic}
          onDoubleClick={manejarDobleClic}
          title="Clic para completar · Doble clic para editar"
        >
          {tarea.titulo}
        </span>
      )}
      <button onClick={onEliminar} className="btn-eliminar" title="Eliminar">🗑</button>
    </li>
  );
}
