#!/bin/sh
set -eu

project_dir=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
backup_dir=${BACKUP_DIR:-"$project_dir/backups"}
retention_days=${BACKUP_RETENTION_DAYS:-14}
timestamp=$(date -u +%Y%m%dT%H%M%SZ)
final_file="$backup_dir/naje-$timestamp.dump"
temporary_file="$final_file.tmp"

trap 'rm -f "$temporary_file"' EXIT HUP INT TERM

mkdir -p "$backup_dir"
chmod 700 "$backup_dir"

cd "$project_dir"

db_container_id=$(docker compose ps -q db)
if [ -z "$db_container_id" ]; then
  echo "Error: container database belum berjalan." >&2
  exit 1
fi

echo "Menunggu database siap..."
attempt=0
while [ "$attempt" -lt 30 ]; do
  health=$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}unknown{{end}}' "$db_container_id")
  if [ "$health" = "healthy" ]; then
    break
  fi
  if [ "$health" = "unhealthy" ]; then
    docker compose logs --tail=100 db
    echo "Error: health check database gagal." >&2
    exit 1
  fi
  attempt=$((attempt + 1))
  sleep 2
done

if [ "$health" != "healthy" ]; then
  docker compose logs --tail=100 db
  echo "Error: database belum siap setelah 60 detik." >&2
  exit 1
fi

docker compose exec -T db sh -lc 'pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" --format=custom --no-owner --no-privileges' > "$temporary_file"
mv "$temporary_file" "$final_file"
chmod 600 "$final_file"

find "$backup_dir" -type f -name 'naje-*.dump' -mtime "+$retention_days" -delete
echo "Backup dibuat: $final_file"
