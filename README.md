# Naje Nutrition

Web app untuk mengelola bisnis katering bergizi berbasis langganan.

## Stack

- Next.js 16, React 19, TypeScript, dan Tailwind CSS
- Auth.js dengan Google OAuth
- PostgreSQL, Drizzle ORM, dan Drizzle Kit

## Fitur saat ini

- Landing page responsif
- Google sign-in melalui Auth.js
- Penyimpanan akun dan sesi di PostgreSQL
- Dashboard pelanggan terproteksi
- Onboarding profil, alamat utama, alergi, dan preferensi makanan
- Dashboard admin dengan pemeriksaan role
- Skema awal alamat, paket, langganan, menu, pesanan, dan pembayaran

Beberapa kartu dashboard masih menggunakan data contoh untuk memvalidasi alur dan desain sebelum modul transaksi dikembangkan.

## Menjalankan secara lokal

Persyaratan: Node.js 24+, npm, dan PostgreSQL 17+.

```bash
cp .env.example .env
npm install
npm run db:migrate
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

### Google OAuth

Buat OAuth Client bertipe Web Application di Google Cloud Console, lalu tambahkan:

- JavaScript origin: `http://localhost:3000`
- Redirect URI: `http://localhost:3000/api/auth/callback/google`

Salin Client ID dan Client Secret ke `AUTH_GOOGLE_ID` dan `AUTH_GOOGLE_SECRET` di `.env`. Isi `AUTH_SECRET` dengan nilai acak minimal 32 byte.

## Database

Setelah mengubah `src/lib/db/schema.ts`:

```bash
npm run db:generate
npm run db:migrate
```

Akun baru memiliki role `customer`. Untuk memberikan akses admin pertama:

```sql
UPDATE users SET role = 'owner' WHERE email = 'email-pemilik@example.com';
```

## Pemeriksaan kualitas

```bash
npm run lint
npm run typecheck
npm run build
```

## Deployment VPS

Target yang disarankan adalah Ubuntu LTS dengan minimal 2 vCPU, RAM 2 GB, Docker Engine, Docker Compose plugin, domain, serta port `80` dan `443` yang terbuka. PostgreSQL hanya dipublikasikan ke loopback VPS dan tidak dapat diakses langsung dari internet.

### 1. Persiapkan DNS dan Google OAuth

- Arahkan record `A` domain ke IP publik VPS.
- Tambahkan `https://domain.example` sebagai Authorized JavaScript Origin.
- Tambahkan `https://domain.example/api/auth/callback/google` sebagai Authorized Redirect URI.

### 2. Persiapkan aplikasi di VPS

Clone repository ke direktori seperti `/opt/naje`, lalu:

```bash
cp .env.example .env
chmod 600 .env
```

Isi minimal variabel berikut:

```dotenv
APP_DOMAIN=domain.example
AUTH_URL=https://domain.example
AUTH_SECRET=nilai_acak_minimal_32_byte
AUTH_GOOGLE_ID=google_client_id
AUTH_GOOGLE_SECRET=google_client_secret
POSTGRES_DB=katering_naje
POSTGRES_USER=naje
POSTGRES_PASSWORD=password_database_yang_kuat
```

`AUTH_SECRET` dapat dibuat dengan `openssl rand -base64 32`. Untuk
`POSTGRES_PASSWORD`, gunakan `openssl rand -hex 32` agar password aman saat
dimasukkan ke dalam connection URL PostgreSQL. Jangan commit file `.env`.

### 3. Jalankan deployment

```bash
./scripts/deploy.sh
```

Script akan memvalidasi environment, menyalakan PostgreSQL, membuat backup, membangun image, menjalankan migrasi, menyalakan aplikasi dan Caddy, kemudian menunggu health check. Caddy menerbitkan serta memperbarui sertifikat HTTPS secara otomatis.

Untuk deployment berikutnya:

```bash
git pull --ff-only
./scripts/deploy.sh
```

### Backup database

Backup manual:

```bash
./scripts/backup-db.sh
```

Backup disimpan di `backups/` dengan permission terbatas dan retensi default 14 hari. Salin backup secara berkala ke storage lain agar kegagalan disk VPS tidak menghilangkan database sekaligus backup-nya.

Contoh penjadwalan harian melalui crontab VPS:

```cron
0 2 * * * cd /opt/naje && ./scripts/backup-db.sh >> /var/log/naje-backup.log 2>&1
```

### Operasional

```bash
docker compose ps
docker compose logs -f --tail=200 app caddy
docker compose restart app
```

Jika image aplikasi baru bermasalah, checkout commit aplikasi sebelumnya lalu jalankan kembali `./scripts/deploy.sh`. Jangan mengembalikan database tanpa meninjau kompatibilitas migrasinya terlebih dahulu.

## Iterasi berikutnya

1. CRUD paket serta kalender menu admin
2. Checkout dan webhook payment gateway
3. Generator pesanan harian serta rekap produksi
