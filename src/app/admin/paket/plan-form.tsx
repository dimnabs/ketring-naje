"use client";

import { AlertCircle, LoaderCircle, Save } from "lucide-react";
import { useActionState } from "react";

import { initialAdminActionState } from "@/lib/action-state";

import { createPlan, updatePlan } from "./actions";

type PlanFormProps = {
  plan?: {
    id: string;
    name: string;
    slug: string;
    description: string;
    mealCredits: number;
    price: number;
  };
};

const fieldClass = "mt-2 w-full rounded-xl border border-[#173f35]/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#668b42] focus:ring-4 focus:ring-[#d8f36b]/25";

export function PlanForm({ plan }: PlanFormProps) {
  const action = plan ? updatePlan.bind(null, plan.id) : createPlan;
  const [state, formAction, pending] = useActionState(action, initialAdminActionState);

  return (
    <form action={formAction} className="grid gap-4 sm:grid-cols-2">
      {state.status === "error" ? (
        <div role="alert" className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800 sm:col-span-2">
          <AlertCircle size={17} className="mt-0.5 shrink-0" /> {state.message}
        </div>
      ) : null}
      <label className="text-sm font-semibold">
        Nama paket
        <input className={fieldClass} name="name" defaultValue={plan?.name} maxLength={100} placeholder="Complete Care" required />
      </label>
      <label className="text-sm font-semibold">
        Slug
        <input className={fieldClass} name="slug" defaultValue={plan?.slug} maxLength={100} placeholder="Otomatis dari nama" />
      </label>
      <label className="text-sm font-semibold">
        Jumlah porsi
        <input className={fieldClass} type="number" name="mealCredits" defaultValue={plan?.mealCredits ?? 20} min={1} max={365} required />
      </label>
      <label className="text-sm font-semibold">
        Harga paket (rupiah)
        <input className={fieldClass} type="number" name="price" defaultValue={plan?.price} min={1000} max={1000000000} step={1000} placeholder="750000" required />
      </label>
      <label className="text-sm font-semibold sm:col-span-2">
        Deskripsi
        <textarea className={`${fieldClass} min-h-24 resize-y`} name="description" defaultValue={plan?.description} maxLength={500} placeholder="Jelaskan manfaat dan sasaran paket." />
      </label>
      <div className="sm:col-span-2">
        <button type="submit" disabled={pending} className="inline-flex items-center gap-2 rounded-full bg-[#173f35] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#245a4b] disabled:opacity-60">
          {pending ? <LoaderCircle size={16} className="animate-spin" /> : <Save size={16} />}
          {pending ? "Menyimpan..." : plan ? "Simpan perubahan" : "Tambah paket"}
        </button>
      </div>
    </form>
  );
}
