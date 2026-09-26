import { and, asc, eq, gte, lte } from "drizzle-orm";
import { AlertTriangle, ArrowLeft, CalendarDays, ChefHat, Flame, Salad } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { AppShell } from "@/components/app-shell";
import { db } from "@/lib/db";
import { menuSchedules, menus, users } from "@/lib/db/schema";
import { allergyOptions, optionLabels } from "@/lib/profile-options";

export const metadata: Metadata = { title: "Menu saya" };

function jakartaDate() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}

function addDays(value: string, days: number) {
  const date = new Date(`${value}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", { weekday: "long", day: "numeric", month: "long", timeZone: "Asia/Jakarta" }).format(new Date(`${value}T12:00:00+07:00`));
}

export default async function CustomerMenuPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const [account] = await db
    .select({ name: users.name, email: users.email, profileCompleted: users.profileCompleted, allergies: users.allergies })
    .from(users)
    .where(eq(users.email, session.user.email))
    .limit(1);

  if (!account) redirect("/login");
  if (!account.profileCompleted) redirect("/dashboard/pengaturan?onboarding=1");

  const today = jakartaDate();
  const scheduledMenus = await db
    .select({
      id: menuSchedules.id,
      serviceDate: menuSchedules.serviceDate,
      mealType: menuSchedules.mealType,
      name: menus.name,
      description: menus.description,
      calories: menus.calories,
      proteinGrams: menus.proteinGrams,
      carbohydrateGrams: menus.carbohydrateGrams,
      fatGrams: menus.fatGrams,
      allergens: menus.allergens,
    })
    .from(menuSchedules)
    .innerJoin(menus, eq(menuSchedules.menuId, menus.id))
    .where(and(gte(menuSchedules.serviceDate, today), lte(menuSchedules.serviceDate, addDays(today, 30))))
    .orderBy(asc(menuSchedules.serviceDate), asc(menuSchedules.mealType));

  return (
    <AppShell name={account.name} email={account.email} activeHref="/dashboard/menu">
      <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:py-12">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-[#668b42]"><ArrowLeft size={16} /> Ringkasan</Link>
        <div className="mt-5">
          <p className="text-sm font-semibold text-[#668b42]">30 hari ke depan</p>
          <h1 className="display-font mt-2 text-4xl">Menu saya</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6c8179]">Lihat menu yang sudah disiapkan oleh tim gizi beserta informasi nutrisi dan alergennya.</p>
        </div>

        {scheduledMenus.length === 0 ? (
          <div className="mt-8 grid min-h-80 place-items-center rounded-[2rem] border border-dashed border-[#173f35]/20 bg-white/60 p-8 text-center">
            <div><CalendarDays className="mx-auto text-[#668b42]" /><h2 className="mt-4 font-bold">Menu belum dijadwalkan</h2><p className="mt-2 text-sm text-[#6c8179]">Tim Naje sedang menyusun kalender menu berikutnya.</p></div>
          </div>
        ) : (
          <section className="mt-8 grid gap-5 md:grid-cols-2">
            {scheduledMenus.map((menu) => {
              const allergenLabels = optionLabels(menu.allergens, allergyOptions);
              const conflicts = menu.allergens.filter((allergen) => account.allergies.includes(allergen));
              const conflictLabels = optionLabels(conflicts, allergyOptions);
              return (
                <article key={menu.id} className="overflow-hidden rounded-[2rem] border border-[#173f35]/10 bg-white">
                  <div className="flex items-center justify-between bg-[#173f35] px-6 py-4 text-white">
                    <div><p className="text-xs font-bold uppercase tracking-[.14em] text-[#d8f36b]">{formatDate(menu.serviceDate)}</p><p className="mt-1 text-sm text-white/60">{menu.mealType === "lunch" ? "Makan siang" : "Makan malam"}</p></div>
                    <ChefHat size={22} className="text-[#d8f36b]" />
                  </div>
                  <div className="p-6">
                    <h2 className="display-font text-2xl">{menu.name}</h2>
                    {menu.description ? <p className="mt-3 text-sm leading-6 text-[#6c8179]">{menu.description}</p> : null}
                    <div className="mt-5 grid grid-cols-4 gap-2 text-center">
                      <div className="rounded-xl bg-[#f4f6f1] p-3"><Flame size={15} className="mx-auto text-[#c77645]" /><strong className="mt-1 block text-sm">{menu.calories}</strong><span className="text-[10px] text-[#7b8e87]">kkal</span></div>
                      {[['Protein', menu.proteinGrams], ['Karbo', menu.carbohydrateGrams], ['Lemak', menu.fatGrams]].map(([label, value]) => <div key={label} className="rounded-xl bg-[#f4f6f1] p-3"><Salad size={15} className="mx-auto text-[#668b42]" /><strong className="mt-1 block text-sm">{value}g</strong><span className="text-[10px] text-[#7b8e87]">{label}</span></div>)}
                    </div>
                    <p className="mt-4 text-xs text-[#7b8e87]">Alergen: {allergenLabels.length ? allergenLabels.join(", ") : "tidak ada yang dicatat"}</p>
                    {conflictLabels.length ? <div className="mt-4 flex items-start gap-2 rounded-xl border border-[#efb6ad] bg-[#fff4f2] p-3 text-xs font-semibold text-[#93463c]"><AlertTriangle size={16} className="shrink-0" />Mengandung alergen profilmu: {conflictLabels.join(", ")}. Hubungi tim Naje sebelum memesan.</div> : null}
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </main>
    </AppShell>
  );
}
