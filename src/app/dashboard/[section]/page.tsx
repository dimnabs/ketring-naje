import { ArrowLeft, Construction } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { AppShell } from "@/components/app-shell";

const sectionNames: Record<string, string> = {
  menu: "Menu saya",
  jadwal: "Jadwal pengiriman",
  pembayaran: "Pembayaran",
  pengaturan: "Pengaturan akun",
};

export default async function CustomerSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { section } = await params;
  const title = sectionNames[section] ?? "Halaman pelanggan";

  return (
    <AppShell name={session.user.name} email={session.user.email}>
      <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:py-12">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-[#668b42]"><ArrowLeft size={16} /> Ringkasan</Link>
        <h1 className="display-font mt-6 text-4xl">{title}</h1>
        <div className="mt-9 grid min-h-96 place-items-center rounded-[2rem] border border-dashed border-[#173f35]/20 bg-white/60 p-8 text-center">
          <div className="max-w-sm">
            <span className="mx-auto grid size-14 place-items-center rounded-full bg-[#e5efdf] text-[#527c4d]"><Construction /></span>
            <h2 className="mt-5 text-lg font-bold">Modul berikutnya</h2>
            <p className="mt-2 text-sm leading-6 text-[#6c8179]">Struktur rute sudah siap. Fitur ini akan disambungkan ke data riil pada tahap pengembangan selanjutnya.</p>
          </div>
        </div>
      </main>
    </AppShell>
  );
}
