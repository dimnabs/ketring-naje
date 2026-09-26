import { and, asc, eq, gte } from "drizzle-orm";
import { AlertCircle, ArrowLeft, CalendarDays, CheckCircle2, ChefHat } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { AppShell } from "@/components/app-shell";
import { requireStaff } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { menuSchedules, menus } from "@/lib/db/schema";
import { allergyOptions, optionLabels } from "@/lib/profile-options";

import { deleteSchedule, setMenuActive } from "./actions";
import { MenuForm } from "./menu-form";
import { ScheduleForm } from "./schedule-form";

export const metadata: Metadata = { title: "Menu dan jadwal | Admin" };

function jakartaDate() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", { weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Jakarta" }).format(new Date(`${value}T12:00:00+07:00`));
}

const successMessages: Record<string, string> = {
  "menu-created": "Menu berhasil ditambahkan.",
  "menu-updated": "Menu berhasil diperbarui.",
  scheduled: "Jadwal menu berhasil disimpan.",
  "schedule-deleted": "Jadwal berhasil dihapus.",
};

export default async function MenusPage({ searchParams }: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  const account = await requireStaff();
  const today = jakartaDate();
  const [allMenus, upcomingSchedules] = await Promise.all([
    db.select().from(menus).orderBy(asc(menus.name)),
    db
      .select({ id: menuSchedules.id, serviceDate: menuSchedules.serviceDate, mealType: menuSchedules.mealType, capacity: menuSchedules.capacity, menuName: menus.name })
      .from(menuSchedules)
      .innerJoin(menus, eq(menuSchedules.menuId, menus.id))
      .where(and(gte(menuSchedules.serviceDate, today)))
      .orderBy(asc(menuSchedules.serviceDate), asc(menuSchedules.mealType)),
  ]);
  const activeMenus = allMenus.filter((menu) => menu.isActive);
  const { saved, error } = await searchParams;

  return (
    <AppShell mode="admin" name={account.name} email={account.email} activeHref="/admin/menu">
      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-12">
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm font-semibold text-[#668b42]"><ArrowLeft size={16} /> Operasional</Link>
        <div className="mt-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div><p className="text-sm font-semibold text-[#668b42]">Dapur dan gizi</p><h1 className="display-font mt-2 text-4xl">Menu dan kalender</h1></div>
          <span className="text-sm text-[#6c8179]">{activeMenus.length} menu aktif · {upcomingSchedules.length} jadwal mendatang</span>
        </div>

        {saved && successMessages[saved] ? <div className="mt-6 flex items-center gap-2 rounded-2xl border border-[#a7c987] bg-[#f0f8e8] p-4 text-sm font-semibold text-[#416338]"><CheckCircle2 size={18} />{successMessages[saved]}</div> : null}
        {error === "schedule-in-use" ? <div className="mt-6 flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-800"><AlertCircle size={18} />Jadwal tidak dapat dihapus karena sudah memiliki pesanan.</div> : null}

        <section className="mt-7 rounded-[2rem] bg-[#173f35] p-6 text-white sm:p-8">
          <div className="mb-6 flex items-center gap-3"><CalendarDays className="text-[#d8f36b]" /><div><h2 className="text-lg font-bold">Jadwalkan menu</h2><p className="mt-1 text-sm text-white/55">Tanggal dan waktu yang sama akan diperbarui jika sudah ada.</p></div></div>
          <div className="rounded-2xl bg-white p-5 text-[#18322b]"><ScheduleForm menus={activeMenus.map(({ id, name }) => ({ id, name }))} minDate={today} /></div>
        </section>

        <section className="mt-7 grid gap-5 xl:grid-cols-[.85fr_1.15fr]">
          <div className="rounded-[2rem] border border-[#173f35]/10 bg-white p-6">
            <h2 className="text-lg font-bold">Kalender mendatang</h2>
            <div className="mt-5 space-y-3">
              {upcomingSchedules.length === 0 ? <p className="rounded-2xl bg-[#f5f7f2] p-6 text-center text-sm text-[#6c8179]">Belum ada jadwal menu.</p> : upcomingSchedules.map((schedule) => (
                <article key={schedule.id} className="flex items-center justify-between gap-4 rounded-2xl border border-[#173f35]/10 p-4">
                  <div><p className="text-xs font-bold uppercase tracking-wide text-[#668b42]">{formatDate(schedule.serviceDate)} · {schedule.mealType === "lunch" ? "Siang" : "Malam"}</p><h3 className="mt-1 font-bold">{schedule.menuName}</h3><p className="mt-1 text-xs text-[#7b8e87]">Kapasitas {schedule.capacity} porsi</p></div>
                  <details className="shrink-0 text-right">
                    <summary className="cursor-pointer text-xs font-bold text-[#ad5347]">Hapus</summary>
                    <form action={deleteSchedule} className="mt-2"><input type="hidden" name="scheduleId" value={schedule.id} /><button type="submit" className="rounded-full bg-[#ad5347] px-3 py-1.5 text-[11px] font-bold text-white">Konfirmasi</button></form>
                  </details>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#173f35]/10 bg-white p-6">
            <div className="mb-6 flex items-center gap-3"><ChefHat className="text-[#668b42]" /><h2 className="text-lg font-bold">Tambah menu baru</h2></div>
            <MenuForm />
          </div>
        </section>

        <section className="mt-7 space-y-4">
          <h2 className="text-lg font-bold">Katalog menu</h2>
          {allMenus.length === 0 ? <div className="rounded-[2rem] border border-dashed border-[#173f35]/20 bg-white/60 p-10 text-center text-sm text-[#6c8179]">Belum ada menu. Tambahkan resep pertamamu.</div> : allMenus.map((menu) => {
            const allergenLabels = optionLabels(menu.allergens, allergyOptions);
            return (
              <article key={menu.id} className="rounded-[2rem] border border-[#173f35]/10 bg-white p-6">
                <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                  <div>
                    <div className="flex flex-wrap items-center gap-2"><h3 className="text-lg font-bold">{menu.name}</h3><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${menu.isActive ? "bg-[#d8f36b] text-[#354b27]" : "bg-[#e8ece8] text-[#718078]"}`}>{menu.isActive ? "Aktif" : "Nonaktif"}</span></div>
                    <p className="mt-2 text-sm font-semibold text-[#527066]">{menu.calories} kkal · P {menu.proteinGrams}g · K {menu.carbohydrateGrams}g · L {menu.fatGrams}g</p>
                    {menu.description ? <p className="mt-3 max-w-3xl text-sm leading-6 text-[#6c8179]">{menu.description}</p> : null}
                    <p className="mt-3 text-xs text-[#8a6a63]">Alergen: {allergenLabels.length ? allergenLabels.join(", ") : "tidak dicatat"}</p>
                  </div>
                  <form action={setMenuActive}><input type="hidden" name="menuId" value={menu.id} /><input type="hidden" name="active" value={String(!menu.isActive)} /><button type="submit" className="rounded-full border border-[#173f35]/15 px-4 py-2 text-xs font-bold hover:bg-[#f3f5ef]">{menu.isActive ? "Nonaktifkan" : "Aktifkan"}</button></form>
                </div>
                <details className="mt-5 border-t border-[#173f35]/10 pt-5"><summary className="cursor-pointer text-sm font-bold text-[#668b42]">Edit menu</summary><div className="mt-5"><MenuForm menu={{ id: menu.id, name: menu.name, description: menu.description ?? "", imageUrl: menu.imageUrl ?? "", calories: menu.calories, proteinGrams: menu.proteinGrams, carbohydrateGrams: menu.carbohydrateGrams, fatGrams: menu.fatGrams, allergens: menu.allergens }} /></div></details>
              </article>
            );
          })}
        </section>
      </main>
    </AppShell>
  );
}
