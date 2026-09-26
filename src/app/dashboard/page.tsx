import { and, eq } from "drizzle-orm";
import { CalendarDays, ChevronRight, Clock3, MapPin, UtensilsCrossed } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { AppShell } from "@/components/app-shell";
import { db } from "@/lib/db";
import { addresses, users } from "@/lib/db/schema";
import { allergyOptions, optionLabels } from "@/lib/profile-options";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const [account] = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      profileCompleted: users.profileCompleted,
      allergies: users.allergies,
    })
    .from(users)
    .where(eq(users.email, session.user.email))
    .limit(1);

  if (!account) redirect("/login");
  if (!account.profileCompleted) redirect("/dashboard/pengaturan?onboarding=1");

  const [primaryAddress] = await db
    .select({ label: addresses.label, city: addresses.city })
    .from(addresses)
    .where(and(eq(addresses.userId, account.id), eq(addresses.isPrimary, true)))
    .limit(1);

  const allergyLabels = optionLabels(account.allergies, allergyOptions);
  const todayLabel = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(new Date());

  return (
    <AppShell name={account.name} email={account.email}>
      <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:py-12">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold text-[#668b42]">Halo, {account.name?.split(" ")[0] ?? "teman"} 👋</p>
            <h1 className="display-font mt-2 text-4xl">Makan enakmu sudah disiapkan.</h1>
          </div>
          <p className="text-sm text-[#6c8179]">{todayLabel}</p>
        </div>

        <section className="mt-9 grid gap-5 lg:grid-cols-[1.3fr_.7fr]">
          <article className="relative overflow-hidden rounded-[2rem] bg-[#173f35] p-7 text-white sm:p-9">
            <div className="absolute -right-16 -top-16 size-56 rounded-full bg-[#d8f36b]/20 blur-2xl" />
            <p className="relative text-xs font-bold tracking-[.18em] text-[#d8f36b] uppercase">Pengiriman berikutnya</p>
            <div className="relative mt-6 grid gap-8 sm:grid-cols-[1fr_auto] sm:items-end">
              <div>
                <h2 className="display-font text-3xl">Ayam rempah Nusantara</h2>
                <div className="mt-5 flex flex-wrap gap-4 text-sm text-white/60">
                  <span className="flex items-center gap-2"><Clock3 size={16} /> 11.00–13.00</span>
                  <span className="flex items-center gap-2"><MapPin size={16} /> Alamat utama</span>
                </div>
              </div>
              <span className="rounded-full bg-white/10 px-4 py-2 text-xs font-semibold">485 kkal</span>
            </div>
          </article>

          <article className="rounded-[2rem] border border-[#173f35]/10 bg-white p-7">
            <div className="flex items-center justify-between">
              <span className="grid size-11 place-items-center rounded-full bg-[#e5efdf] text-[#527c4d]"><UtensilsCrossed size={20} /></span>
              <span className="rounded-full bg-[#d8f36b] px-3 py-1 text-[10px] font-bold uppercase">Aktif</span>
            </div>
            <p className="mt-7 text-sm text-[#6c8179]">Sisa paket</p>
            <p className="display-font mt-1 text-4xl">18 <span className="text-xl">porsi</span></p>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#edf0e8]"><div className="h-full w-[70%] rounded-full bg-[#789c49]" /></div>
            <p className="mt-3 text-xs text-[#8a9b94]">Complete Care · 20 kali makan</p>
          </article>
        </section>

        <section className="mt-5 grid gap-5 md:grid-cols-3">
          {[
            [CalendarDays, "Jadwal minggu ini", "5 pengiriman terjadwal", "/dashboard/jadwal"],
            [MapPin, "Alamat pengiriman", primaryAddress ? `${primaryAddress.label} · ${primaryAddress.city}` : "Belum diatur", "/dashboard/pengaturan"],
            [UtensilsCrossed, "Catatan alergi", allergyLabels.length ? allergyLabels.slice(0, 2).join(", ") : "Tidak ada alergi dicatat", "/dashboard/pengaturan"],
          ].map(([Icon, title, detail, href]) => {
            const CardIcon = Icon as typeof CalendarDays;
            return (
              <Link key={title as string} href={href as string} className="group rounded-[1.5rem] border border-[#173f35]/10 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-lg">
                <CardIcon size={20} className="text-[#668b42]" />
                <h3 className="mt-5 font-bold">{title as string}</h3>
                <div className="mt-2 flex items-center justify-between text-sm text-[#7b8e87]"><span>{detail as string}</span><ChevronRight size={16} className="transition group-hover:translate-x-1" /></div>
              </Link>
            );
          })}
        </section>

        <div className="mt-7 rounded-2xl border border-dashed border-[#173f35]/20 p-5 text-center text-sm text-[#6c8179]">
          Data pada dashboard masih contoh. Setelah paket pertama dibeli, data operasional akan tampil di sini.
        </div>
      </main>
    </AppShell>
  );
}
