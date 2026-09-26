import { ArrowLeft, Check, Leaf, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { auth, signIn } from "@/auth";

export const metadata: Metadata = { title: "Masuk" };

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect("/dashboard");

  return (
    <main className="grid min-h-screen bg-[#f7f7f2] lg:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-[#173f35] p-12 text-white lg:flex lg:flex-col">
        <div className="absolute -right-24 -top-24 size-96 rounded-full bg-[#d8f36b]/20 blur-3xl" />
        <Link href="/" className="relative flex items-center gap-2.5">
          <span className="grid size-10 place-items-center rounded-full bg-[#d8f36b] text-[#173f35]"><Leaf size={19} /></span>
          <strong className="display-font text-2xl">Naje Nutrition</strong>
        </Link>
        <div className="relative my-auto max-w-lg">
          <p className="text-xs font-bold tracking-[.2em] text-[#d8f36b] uppercase">Sehat, tanpa ribet</p>
          <h1 className="display-font mt-6 text-6xl leading-[1.02]">Satu langkah menuju rutinitas yang lebih baik.</h1>
          <div className="mt-10 space-y-4 text-sm text-white/65">
            {["Pantau menu dan informasi gizi", "Atur jadwal pengiriman", "Kelola langganan dalam satu tempat"].map((item) => (
              <p key={item} className="flex items-center gap-3"><span className="grid size-6 place-items-center rounded-full bg-white/10 text-[#d8f36b]"><Check size={14} /></span>{item}</p>
            ))}
          </div>
        </div>
        <p className="relative text-xs text-white/35">Dirancang dengan perhatian oleh ahli gizi.</p>
      </section>

      <section className="flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-14 inline-flex items-center gap-2 text-sm font-semibold text-[#527066] hover:text-[#173f35] lg:hidden"><ArrowLeft size={16} /> Kembali</Link>
          <div className="lg:hidden">
            <span className="grid size-12 place-items-center rounded-full bg-[#173f35] text-[#d8f36b]"><Leaf size={22} /></span>
          </div>
          <h2 className="display-font mt-7 text-4xl sm:text-5xl">Selamat datang.</h2>
          <p className="mt-4 leading-7 text-[#527066]">Masuk untuk memilih paket, melihat menu, dan mengelola jadwal kateringmu.</p>

          <form
            className="mt-9"
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/dashboard" });
            }}
          >
            <button type="submit" className="flex w-full items-center justify-center gap-3 rounded-2xl border border-[#173f35]/15 bg-white px-5 py-4 font-bold shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <span className="grid size-7 place-items-center rounded-full bg-white text-lg font-bold text-[#4285f4] shadow-sm">G</span>
              Lanjutkan dengan Google
            </button>
          </form>

          <div className="mt-7 flex gap-3 rounded-2xl bg-[#e8eee4] p-4 text-xs leading-5 text-[#527066]">
            <ShieldCheck className="mt-0.5 shrink-0 text-[#527c4d]" size={18} />
            <p>Kami hanya menggunakan nama, email, dan foto profil Google untuk membuat akunmu.</p>
          </div>
          <p className="mt-7 text-center text-xs leading-5 text-[#789087]">Dengan melanjutkan, kamu menyetujui syarat layanan dan kebijakan privasi Naje Nutrition.</p>
        </div>
      </section>
    </main>
  );
}
