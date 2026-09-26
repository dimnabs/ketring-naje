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

## Iterasi berikutnya

1. Onboarding profil, alamat, alergi, dan preferensi pelanggan
2. CRUD paket serta kalender menu admin
3. Checkout dan webhook payment gateway
4. Generator pesanan harian serta rekap produksi
