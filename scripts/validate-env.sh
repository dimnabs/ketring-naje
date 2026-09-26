#!/bin/sh
set -eu

project_dir=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
env_file="$project_dir/.env"

if [ ! -f "$env_file" ]; then
  echo "Error: .env tidak ditemukan. Salin .env.example lalu isi nilainya." >&2
  exit 1
fi

required_vars="APP_DOMAIN AUTH_URL AUTH_SECRET AUTH_GOOGLE_ID AUTH_GOOGLE_SECRET POSTGRES_DB POSTGRES_USER POSTGRES_PASSWORD"
missing=""

for name in $required_vars; do
  line=$(sed -n "s/^${name}=//p" "$env_file" | tail -n 1)
  case "$line" in
    ""|replace_with_*) missing="$missing $name" ;;
  esac
done

if [ -n "$missing" ]; then
  echo "Error: variabel berikut belum diisi:$missing" >&2
  exit 1
fi

auth_url=$(sed -n 's/^AUTH_URL=//p' "$env_file" | tail -n 1)
app_domain=$(sed -n 's/^APP_DOMAIN=//p' "$env_file" | tail -n 1)

case "$app_domain" in
  http://*|https://*|*/*) echo "Error: APP_DOMAIN harus berupa hostname tanpa protokol atau path." >&2; exit 1 ;;
esac

if [ "$app_domain" != "localhost" ]; then
  case "$auth_url" in
    https://*) ;;
    *) echo "Error: AUTH_URL produksi harus menggunakan https://" >&2; exit 1 ;;
  esac
fi

echo "Environment valid."
