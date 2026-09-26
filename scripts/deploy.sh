#!/bin/sh
set -eu

project_dir=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
cd "$project_dir"

./scripts/validate-env.sh

if ! command -v docker >/dev/null 2>&1; then
  echo "Error: Docker belum terpasang." >&2
  exit 1
fi

if ! docker compose version >/dev/null 2>&1; then
  echo "Error: Docker Compose plugin belum tersedia." >&2
  exit 1
fi

echo "Menyalakan database..."
docker compose up -d db

echo "Membuat backup sebelum migrasi..."
./scripts/backup-db.sh

echo "Membangun image aplikasi..."
docker compose build app migrate

echo "Menjalankan migrasi database..."
docker compose run --rm migrate

echo "Menjalankan aplikasi dan reverse proxy..."
docker compose up -d app caddy --remove-orphans

container_id=$(docker compose ps -q app)
attempt=0
while [ "$attempt" -lt 30 ]; do
  health=$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}unknown{{end}}' "$container_id")
  if [ "$health" = "healthy" ]; then
    docker compose ps
    echo "Deploy selesai dan aplikasi sehat."
    exit 0
  fi
  if [ "$health" = "unhealthy" ]; then
    docker compose logs --tail=100 app
    echo "Error: health check aplikasi gagal." >&2
    exit 1
  fi
  attempt=$((attempt + 1))
  sleep 2
done

docker compose logs --tail=100 app
echo "Error: aplikasi belum sehat setelah 60 detik." >&2
exit 1
