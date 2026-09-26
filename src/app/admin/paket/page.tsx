import { desc } from "drizzle-orm";
import { ArrowLeft, CheckCircle2, PackageOpen } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { AppShell } from "@/components/app-shell";
import { requireStaff } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { plans } from "@/lib/db/schema";

import { setPlanActive } from "./actions";
import { PlanForm } from "./plan-form";

export const metadata: Metadata = { title: "Paket katering | Admin" };

const rupiah = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });

export default async function PlansPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const account = await requireStaff(["admin", "owner"]);
  const allPlans = await db.select().from(plans).orderBy(desc(plans.createdAt));
  const { saved } = await searchParams;

  return (
    <AppShell mode="admin" name={account.name} email={account.email} activeHref="/admin/paket">
      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-12">
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm font-semibold text-[#668b42]"><ArrowLeft size={16} /> Operasional</Link>
        <div className="mt-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold text-[#668b42]">Penawaran</p>
            <h1 className="display-font mt-2 text-4xl">Paket katering</h1>
          </div>
          <span className="text-sm text-[#6c8179]">{allPlans.filter((plan) => plan.isActive).length} paket aktif</span>
        </div>

        {saved ? (
          <div className="mt-6 flex items-center gap-2 rounded-2xl border border-[#a7c987] bg-[#f0f8e8] p-4 text-sm font-semibold text-[#416338]">
            <CheckCircle2 size={18} /> Paket berhasil {saved === "created" ? "ditambahkan" : "diperbarui"}.
          </div>
        ) : null}

        <section className="mt-7 rounded-[2rem] border border-[#173f35]/10 bg-white p-6 sm:p-8">
          <div className="mb-6 flex items-center gap-3"><PackageOpen className="text-[#668b42]" /><h2 className="text-lg font-bold">Tambah paket baru</h2></div>
          <PlanForm />
        </section>

        <section className="mt-7 space-y-4">
          <h2 className="text-lg font-bold">Daftar paket</h2>
          {allPlans.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-[#173f35]/20 bg-white/60 p-10 text-center text-sm text-[#6c8179]">Belum ada paket. Tambahkan penawaran pertamamu di atas.</div>
          ) : allPlans.map((plan) => (
            <article key={plan.id} className="rounded-[2rem] border border-[#173f35]/10 bg-white p-6">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-bold">{plan.name}</h3>
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${plan.isActive ? "bg-[#d8f36b] text-[#354b27]" : "bg-[#e8ece8] text-[#718078]"}`}>{plan.isActive ? "Aktif" : "Nonaktif"}</span>
                  </div>
                  <p className="mt-2 text-sm text-[#6c8179]">{plan.mealCredits} porsi · {rupiah.format(plan.price)} · /{plan.slug}</p>
                  {plan.description ? <p className="mt-3 max-w-2xl text-sm leading-6 text-[#536861]">{plan.description}</p> : null}
                </div>
                <form action={setPlanActive}>
                  <input type="hidden" name="planId" value={plan.id} />
                  <input type="hidden" name="active" value={String(!plan.isActive)} />
                  <button className="rounded-full border border-[#173f35]/15 px-4 py-2 text-xs font-bold transition hover:bg-[#f3f5ef]" type="submit">{plan.isActive ? "Nonaktifkan" : "Aktifkan"}</button>
                </form>
              </div>
              <details className="mt-5 border-t border-[#173f35]/10 pt-5">
                <summary className="cursor-pointer text-sm font-bold text-[#668b42]">Edit paket</summary>
                <div className="mt-5">
                  <PlanForm plan={{ id: plan.id, name: plan.name, slug: plan.slug, description: plan.description ?? "", mealCredits: plan.mealCredits, price: plan.price }} />
                </div>
              </details>
            </article>
          ))}
        </section>
      </main>
    </AppShell>
  );
}
