#!/bin/sh
set -eu

project_dir=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
backup_dir=${BACKUP_DIR:-"$project_dir/backups"}
retention_days=${BACKUP_RETENTION_DAYS:-14}
timestamp=$(date -u +%Y%m%dT%H%M%SZ)
final_file="$backup_dir/naje-$timestamp.dump"
temporary_file="$final_file.tmp"

mkdir -p "$backup_dir"
chmod 700 "$backup_dir"

cd "$project_dir"
docker compose exec -T db sh -lc 'pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" --format=custom --no-owner --no-privileges' > "$temporary_file"
mv "$temporary_file" "$final_file"
chmod 600 "$final_file"

find "$backup_dir" -type f -name 'naje-*.dump' -mtime "+$retention_days" -delete
echo "Backup dibuat: $final_file"
