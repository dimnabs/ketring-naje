"use client";

import { AlertCircle, Check, LoaderCircle, MapPin, Salad, ShieldCheck, UserRound } from "lucide-react";
import { useActionState } from "react";

import { allergyOptions, dietaryPreferenceOptions } from "@/lib/profile-options";

import { saveProfile, type ProfileActionState } from "./actions";

const initialProfileActionState: ProfileActionState = {
  status: "idle",
  message: "",
};

type ProfileFormProps = {
  account: {
    name: string;
    email: string;
    phone: string;
    dietaryPreferences: string[];
    allergies: string[];
    dietaryNotes: string;
  };
  address: {
    label: string;
    addressLine: string;
    city: string;
    postalCode: string;
    deliveryNotes: string;
  };
};

const inputClass =
  "mt-2 w-full rounded-xl border border-[#173f35]/15 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-[#9cab9f] focus:border-[#668b42] focus:ring-4 focus:ring-[#d8f36b]/25";

function SubmitButton({ pending }: { pending: boolean }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-w-44 items-center justify-center gap-2 rounded-full bg-[#173f35] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#245a4b] disabled:cursor-wait disabled:opacity-70"
    >
      {pending ? <LoaderCircle size={17} className="animate-spin" /> : <Check size={17} />}
      {pending ? "Menyimpan..." : "Simpan profil"}
    </button>
  );
}

export function ProfileForm({ account, address }: ProfileFormProps) {
  const [state, formAction, pending] = useActionState(saveProfile, initialProfileActionState);

  return (
    <form action={formAction} className="space-y-5">
      {state.status === "error" ? (
        <div role="alert" className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <AlertCircle className="mt-0.5 shrink-0" size={18} />
          <p>{state.message}</p>
        </div>
      ) : null}

      <section className="rounded-[2rem] border border-[#173f35]/10 bg-white p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#e5efdf] text-[#527c4d]"><UserRound size={20} /></span>
          <div>
            <h2 className="text-lg font-bold">Data penerima</h2>
            <p className="mt-1 text-sm text-[#6c8179]">Kami menggunakan data ini untuk konfirmasi dan pengantaran.</p>
          </div>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <label className="text-sm font-semibold">
            Nama lengkap
            <input className={inputClass} name="name" defaultValue={account.name} maxLength={120} required />
          </label>
          <label className="text-sm font-semibold">
            Nomor WhatsApp
            <input className={inputClass} name="phone" defaultValue={account.phone} inputMode="tel" maxLength={24} placeholder="Contoh: 0812 3456 7890" required />
          </label>
          <label className="text-sm font-semibold sm:col-span-2">
            Email Google
            <input className={`${inputClass} cursor-not-allowed bg-[#f3f5ef] text-[#71827b]`} value={account.email} readOnly disabled />
          </label>
        </div>
      </section>

      <section className="rounded-[2rem] border border-[#173f35]/10 bg-white p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#fff0e4] text-[#a66137]"><MapPin size={20} /></span>
          <div>
            <h2 className="text-lg font-bold">Alamat utama</h2>
            <p className="mt-1 text-sm text-[#6c8179]">Pastikan alamat berada di dalam area pengiriman Naje.</p>
          </div>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <label className="text-sm font-semibold">
            Label alamat
            <input className={inputClass} name="addressLabel" defaultValue={address.label} maxLength={40} placeholder="Rumah atau Kantor" required />
          </label>
          <label className="text-sm font-semibold">
            Kota/Kabupaten
            <input className={inputClass} name="city" defaultValue={address.city} maxLength={100} required />
          </label>
          <label className="text-sm font-semibold sm:col-span-2">
            Alamat lengkap
            <textarea className={`${inputClass} min-h-28 resize-y`} name="addressLine" defaultValue={address.addressLine} maxLength={500} placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan, dan kecamatan" required />
          </label>
          <label className="text-sm font-semibold">
            Kode pos
            <input className={inputClass} name="postalCode" defaultValue={address.postalCode} inputMode="numeric" maxLength={5} pattern="[0-9]{5}" placeholder="12345" />
          </label>
          <label className="text-sm font-semibold">
            Catatan untuk kurir
            <input className={inputClass} name="deliveryNotes" defaultValue={address.deliveryNotes} maxLength={500} placeholder="Contoh: pagar warna hijau" />
          </label>
        </div>
      </section>

      <section className="rounded-[2rem] border border-[#173f35]/10 bg-white p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#edf5c8] text-[#668b42]"><Salad size={20} /></span>
          <div>
            <h2 className="text-lg font-bold">Preferensi makanan</h2>
            <p className="mt-1 text-sm text-[#6c8179]">Pilih semua yang sesuai agar menu lebih relevan untukmu.</p>
          </div>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {dietaryPreferenceOptions.map((option) => (
            <label key={option.value} className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#173f35]/10 p-4 text-sm font-semibold transition hover:border-[#668b42]/50 has-checked:border-[#668b42] has-checked:bg-[#f3f8dd]">
              <input type="checkbox" name="dietaryPreferences" value={option.value} defaultChecked={account.dietaryPreferences.includes(option.value)} className="size-4 accent-[#668b42]" />
              {option.label}
            </label>
          ))}
        </div>
      </section>

      <section className="rounded-[2rem] border border-[#173f35]/10 bg-white p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#fce8e5] text-[#ad5347]"><ShieldCheck size={20} /></span>
          <div>
            <h2 className="text-lg font-bold">Alergi dan kebutuhan khusus</h2>
            <p className="mt-1 text-sm text-[#6c8179]">Informasi ini akan ditinjau oleh tim gizi sebelum paketmu aktif.</p>
          </div>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {allergyOptions.map((option) => (
            <label key={option.value} className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#173f35]/10 p-4 text-sm font-semibold transition hover:border-[#ad5347]/40 has-checked:border-[#ad5347] has-checked:bg-[#fff4f2]">
              <input type="checkbox" name="allergies" value={option.value} defaultChecked={account.allergies.includes(option.value)} className="size-4 accent-[#ad5347]" />
              {option.label}
            </label>
          ))}
        </div>
        <label className="mt-5 block text-sm font-semibold">
          Catatan tambahan untuk ahli gizi
          <textarea className={`${inputClass} min-h-28 resize-y`} name="dietaryNotes" defaultValue={account.dietaryNotes} maxLength={1000} placeholder="Contoh: sedang menjaga gula darah atau memiliki pantangan lain" />
        </label>
      </section>

      <div className="flex flex-col items-start justify-between gap-4 rounded-[2rem] bg-[#d8f36b] p-6 sm:flex-row sm:items-center">
        <div>
          <p className="font-bold">Data dapat diperbarui kapan saja.</p>
          <p className="mt-1 text-sm text-[#4d6241]">Perubahan akan digunakan untuk pesanan berikutnya.</p>
        </div>
        <SubmitButton pending={pending} />
      </div>
    </form>
  );
}
