#!/usr/bin/env bash
# Genera tareas-app.rar (o .zip si "rar" no está instalado) sin node_modules, dist ni .env reales.
# Uso: ejecutar desde la carpeta que CONTIENE a tareas-app/  →  bash tareas-app/empaquetar.sh
set -e
cd "$(dirname "$0")/.."

if command -v rar >/dev/null 2>&1; then
  rm -f tareas-app.rar
  rar a -r -x'*/node_modules' -x'*/node_modules/*' -x'*/dist' -x'*/dist/*' -x'*/.env' -x'*/package-lock.json.bak' tareas-app.rar tareas-app
  echo "✅ Creado: $(pwd)/tareas-app.rar"
else
  echo "⚠️  'rar' no está instalado: se genera un ZIP (no es RAR)."
  rm -f tareas-app.zip
  zip -r tareas-app.zip tareas-app -x "*/node_modules/*" -x "*/dist/*" -x "*/.env"
  echo "✅ Creado: $(pwd)/tareas-app.zip"
fi
