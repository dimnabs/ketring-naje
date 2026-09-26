import { and, eq, gte, lte } from "drizzle-orm";
import { CircleDollarSign, PackageCheck, ShoppingBag, Truck, Users } from "lucide-react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { AppShell } from "@/components/app-shell";
import { db } from "@/lib/db";
import { orders, users } from "@/lib/db/schema";

export const metadata: Metadata = { title: "Admin" };

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const [account] = await db
    .select({ role: users.role })
    .from(users)
    .where(eq(users.email, session.user.email))
    .limit(1);

  if (!account || !["admin", "owner", "nutritionist"].includes(account.role)) {
    redirect("/dashboard");
  }

  const today = new Date().toISOString().slice(0, 10);
  const dailyOrders = await db
    .select({ id: orders.id, status: orders.status })
    .from(orders)
    .where(and(gte(orders.createdAt, new Date(`${today}T00:00:00+07:00`)), lte(orders.createdAt, new Date(`${today}T23:59:59+07:00`))));

  const delivered = dailyOrders.filter((order) => order.status === "delivered").length;

  return (
    <AppShell mode="admin" name={session.user.name} email={session.user.email}>
      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-12">
        <div>
          <p className="text-sm font-semibold text-[#668b42]">Operasional hari ini</p>
          <h1 className="display-font mt-2 text-4xl">Selamat pagi, tim Naje.</h1>
        </div>

        <section className="mt-9 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            [ShoppingBag, "Pesanan hari ini", dailyOrders.length.toString(), "bg-[#dce8d8]"],
            [PackageCheck, "Sudah terkirim", delivered.toString(), "bg-[#d8f36b]"],
            [Truck, "Dalam pengiriman", dailyOrders.filter((item) => item.status === "delivering").length.toString(), "bg-[#f7d8c2]"],
            [CircleDollarSign, "Pembayaran masuk", "Rp0", "bg-white"],
          ].map(([Icon, label, value, color]) => {
            const StatIcon = Icon as typeof ShoppingBag;
            return (
              <article key={label as string} className={`rounded-[1.5rem] border border-[#173f35]/10 p-6 ${color as string}`}>
                <StatIcon size={20} className="text-[#527c4d]" />
                <p className="mt-6 text-sm text-[#6c8179]">{label as string}</p>
                <p className="mt-1 text-3xl font-extrabold">{value as string}</p>
              </article>
            );
          })}
        </section>

        <section className="mt-6 grid gap-5 lg:grid-cols-[1.4fr_.6fr]">
          <article className="rounded-[2rem] border border-[#173f35]/10 bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-bold">Ringkasan produksi</h2>
              <span className="text-xs text-[#7b8e87]">Hari ini</span>
            </div>
            <div className="mt-10 grid min-h-52 place-items-center rounded-2xl bg-[#f7f8f3] text-center">
              <div><PackageCheck className="mx-auto text-[#8ea087]" /><p className="mt-3 text-sm text-[#7b8e87]">Belum ada pesanan produksi hari ini.</p></div>
            </div>
          </article>
          <article className="rounded-[2rem] bg-[#173f35] p-6 text-white">
            <Users className="text-[#d8f36b]" />
            <h2 className="display-font mt-8 text-3xl">Siapkan pelanggan pertamamu.</h2>
            <p className="mt-4 text-sm leading-6 text-white/55">Aktifkan paket, susun menu mingguan, lalu bagikan website kepada calon pelanggan.</p>
          </article>
        </section>
      </main>
    </AppShell>
  );
}
