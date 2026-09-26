import { eq } from "drizzle-orm";
import { ArrowLeft, Construction } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { AppShell } from "@/components/app-shell";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

const sectionNames: Record<string, string> = {
  pesanan: "Manajemen pesanan",
  menu: "Menu dan jadwal",
  pelanggan: "Data pelanggan",
  paket: "Paket katering",
};

export default async function AdminSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const [account] = await db.select({ role: users.role }).from(users).where(eq(users.email, session.user.email)).limit(1);
  if (!account || !["admin", "owner", "nutritionist"].includes(account.role)) redirect("/dashboard");

  const { section } = await params;
  const title = sectionNames[section] ?? "Halaman admin";

  return (
    <AppShell mode="admin" name={session.user.name} email={session.user.email} activeHref={`/admin/${section}`}>
      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-12">
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm font-semibold text-[#668b42]"><ArrowLeft size={16} /> Operasional</Link>
        <h1 className="display-font mt-6 text-4xl">{title}</h1>
        <div className="mt-9 grid min-h-96 place-items-center rounded-[2rem] border border-dashed border-[#173f35]/20 bg-white/60 p-8 text-center">
          <div className="max-w-sm">
            <span className="mx-auto grid size-14 place-items-center rounded-full bg-[#e5efdf] text-[#527c4d]"><Construction /></span>
            <h2 className="mt-5 text-lg font-bold">Modul siap dikembangkan</h2>
            <p className="mt-2 text-sm leading-6 text-[#6c8179]">Otorisasi admin sudah aktif. Form dan tabel operasional akan ditambahkan pada iterasi berikutnya.</p>
          </div>
        </div>
      </main>
    </AppShell>
  );
}
