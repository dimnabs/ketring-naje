"use client";

import { AlertCircle, LoaderCircle, Save } from "lucide-react";
import { useActionState } from "react";

import { initialAdminActionState } from "@/lib/action-state";
import { allergyOptions } from "@/lib/profile-options";

import { createMenu, updateMenu } from "./actions";

type MenuFormProps = {
  menu?: {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    calories: number;
    proteinGrams: number;
    carbohydrateGrams: number;
    fatGrams: number;
    allergens: string[];
  };
};

const fieldClass = "mt-2 w-full rounded-xl border border-[#173f35]/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#668b42] focus:ring-4 focus:ring-[#d8f36b]/25";

export function MenuForm({ menu }: MenuFormProps) {
  const action = menu ? updateMenu.bind(null, menu.id) : createMenu;
  const [state, formAction, pending] = useActionState(action, initialAdminActionState);

  return (
    <form action={formAction} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {state.status === "error" ? <div role="alert" className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800 sm:col-span-2 lg:col-span-4"><AlertCircle size={17} className="mt-0.5 shrink-0" />{state.message}</div> : null}
      <label className="text-sm font-semibold sm:col-span-2">Nama menu<input className={fieldClass} name="name" defaultValue={menu?.name} maxLength={140} placeholder="Ayam rempah Nusantara" required /></label>
      <label className="text-sm font-semibold sm:col-span-2">URL foto <span className="font-normal text-[#7b8e87]">(opsional)</span><input className={fieldClass} type="url" name="imageUrl" defaultValue={menu?.imageUrl} placeholder="https://..." /></label>
      <label className="text-sm font-semibold sm:col-span-2 lg:col-span-4">Deskripsi<textarea className={`${fieldClass} min-h-24 resize-y`} name="description" defaultValue={menu?.description} maxLength={1000} /></label>
      <label className="text-sm font-semibold">Kalori<input className={fieldClass} type="number" name="calories" defaultValue={menu?.calories ?? 500} min={1} max={5000} required /></label>
      <label className="text-sm font-semibold">Protein (g)<input className={fieldClass} type="number" name="proteinGrams" defaultValue={menu?.proteinGrams ?? 30} min={0} max={1000} required /></label>
      <label className="text-sm font-semibold">Karbohidrat (g)<input className={fieldClass} type="number" name="carbohydrateGrams" defaultValue={menu?.carbohydrateGrams ?? 50} min={0} max={1000} required /></label>
      <label className="text-sm font-semibold">Lemak (g)<input className={fieldClass} type="number" name="fatGrams" defaultValue={menu?.fatGrams ?? 15} min={0} max={1000} required /></label>
      <fieldset className="sm:col-span-2 lg:col-span-4">
        <legend className="text-sm font-semibold">Kandungan alergen</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {allergyOptions.map((option) => <label key={option.value} className="flex cursor-pointer items-center gap-2 rounded-full border border-[#173f35]/10 px-3 py-2 text-xs font-semibold has-checked:border-[#ad5347] has-checked:bg-[#fff4f2]"><input type="checkbox" name="allergens" value={option.value} defaultChecked={menu?.allergens.includes(option.value)} className="accent-[#ad5347]" />{option.label}</label>)}
        </div>
      </fieldset>
      <div className="sm:col-span-2 lg:col-span-4"><button type="submit" disabled={pending} className="inline-flex items-center gap-2 rounded-full bg-[#173f35] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#245a4b] disabled:opacity-60">{pending ? <LoaderCircle size={16} className="animate-spin" /> : <Save size={16} />}{pending ? "Menyimpan..." : menu ? "Simpan perubahan" : "Tambah menu"}</button></div>
    </form>
  );
}
