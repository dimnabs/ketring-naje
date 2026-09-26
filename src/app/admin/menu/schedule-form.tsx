"use client";

import { AlertCircle, CalendarPlus, LoaderCircle } from "lucide-react";
import { useActionState } from "react";

import { initialAdminActionState } from "@/lib/action-state";

import { scheduleMenu } from "./actions";

export function ScheduleForm({ menus, minDate }: { menus: Array<{ id: string; name: string }>; minDate: string }) {
  const [state, formAction, pending] = useActionState(scheduleMenu, initialAdminActionState);
  const fieldClass = "mt-2 w-full rounded-xl border border-[#173f35]/15 bg-white px-4 py-3 text-sm outline-none focus:border-[#668b42] focus:ring-4 focus:ring-[#d8f36b]/25";

  return (
    <form action={formAction} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {state.status === "error" ? <div role="alert" className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800 sm:col-span-2 lg:col-span-4"><AlertCircle size={17} className="mt-0.5 shrink-0" />{state.message}</div> : null}
      <label className="text-sm font-semibold lg:col-span-2">Menu<select className={fieldClass} name="menuId" required defaultValue=""><option value="" disabled>Pilih menu aktif</option>{menus.map((menu) => <option key={menu.id} value={menu.id}>{menu.name}</option>)}</select></label>
      <label className="text-sm font-semibold">Tanggal<input className={fieldClass} type="date" name="serviceDate" min={minDate} required /></label>
      <label className="text-sm font-semibold">Waktu makan<select className={fieldClass} name="mealType" defaultValue="lunch"><option value="lunch">Makan siang</option><option value="dinner">Makan malam</option></select></label>
      <label className="text-sm font-semibold">Kapasitas porsi<input className={fieldClass} type="number" name="capacity" defaultValue={100} min={1} max={10000} required /></label>
      <div className="flex items-end sm:col-span-1 lg:col-span-3"><button type="submit" disabled={pending || menus.length === 0} className="inline-flex items-center gap-2 rounded-full bg-[#d8f36b] px-5 py-3 text-sm font-bold text-[#173f35] transition hover:bg-[#cae65c] disabled:opacity-50">{pending ? <LoaderCircle size={16} className="animate-spin" /> : <CalendarPlus size={16} />}{pending ? "Menjadwalkan..." : "Simpan jadwal"}</button></div>
    </form>
  );
}
