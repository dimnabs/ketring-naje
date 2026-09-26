"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { AdminActionState } from "@/lib/action-state";
import { requireStaff } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { menuSchedules, menus, orders } from "@/lib/db/schema";
import { allergyOptions } from "@/lib/profile-options";

function text(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function integer(formData: FormData, name: string) {
  const value = Number(text(formData, name));
  return Number.isSafeInteger(value) ? value : Number.NaN;
}

function validId(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function validDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
}

function parseMenu(formData: FormData):
  | { ok: true; value: { name: string; description: string | null; imageUrl: string | null; calories: number; proteinGrams: number; carbohydrateGrams: number; fatGrams: number; allergens: string[] } }
  | { ok: false; message: string } {
  const name = text(formData, "name");
  const description = text(formData, "description");
  const imageUrl = text(formData, "imageUrl");
  const calories = integer(formData, "calories");
  const proteinGrams = integer(formData, "proteinGrams");
  const carbohydrateGrams = integer(formData, "carbohydrateGrams");
  const fatGrams = integer(formData, "fatGrams");
  const allowedAllergens = new Set<string>(allergyOptions.map((option) => option.value));
  const allergens = formData.getAll("allergens").filter((value): value is string => typeof value === "string" && allowedAllergens.has(value));

  if (name.length < 3 || name.length > 140) return { ok: false, message: "Nama menu harus terdiri dari 3–140 karakter." };
  if (description.length > 1000) return { ok: false, message: "Deskripsi maksimal 1.000 karakter." };
  if (imageUrl) {
    try {
      const url = new URL(imageUrl);
      if (!['http:', 'https:'].includes(url.protocol)) return { ok: false, message: "URL foto harus menggunakan HTTP atau HTTPS." };
    } catch {
      return { ok: false, message: "URL foto menu tidak valid." };
    }
  }
  if (calories < 1 || calories > 5000) return { ok: false, message: "Kalori harus antara 1–5.000 kkal." };
  for (const [label, value] of [["Protein", proteinGrams], ["Karbohidrat", carbohydrateGrams], ["Lemak", fatGrams]] as const) {
    if (value < 0 || value > 1000) return { ok: false, message: `${label} harus antara 0–1.000 gram.` };
  }

  return { ok: true, value: { name, description: description || null, imageUrl: imageUrl || null, calories, proteinGrams, carbohydrateGrams, fatGrams, allergens } };
}

export async function createMenu(_state: AdminActionState, formData: FormData): Promise<AdminActionState> {
  await requireStaff();
  const parsed = parseMenu(formData);
  if (!parsed.ok) return { status: "error", message: parsed.message };

  await db.insert(menus).values(parsed.value);
  revalidatePath("/admin/menu");
  redirect("/admin/menu?saved=menu-created");
}

export async function updateMenu(menuId: string, _state: AdminActionState, formData: FormData): Promise<AdminActionState> {
  await requireStaff();
  if (!validId(menuId)) return { status: "error", message: "ID menu tidak valid." };
  const parsed = parseMenu(formData);
  if (!parsed.ok) return { status: "error", message: parsed.message };

  await db.update(menus).set({ ...parsed.value, updatedAt: new Date() }).where(eq(menus.id, menuId));
  revalidatePath("/admin/menu");
  redirect("/admin/menu?saved=menu-updated");
}

export async function setMenuActive(formData: FormData) {
  await requireStaff();
  const menuId = text(formData, "menuId");
  if (!validId(menuId)) return;

  await db.update(menus).set({ isActive: text(formData, "active") === "true", updatedAt: new Date() }).where(eq(menus.id, menuId));
  revalidatePath("/admin/menu");
}

function jakartaDate() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}

export async function scheduleMenu(_state: AdminActionState, formData: FormData): Promise<AdminActionState> {
  await requireStaff();
  const menuId = text(formData, "menuId");
  const serviceDate = text(formData, "serviceDate");
  const selectedMealType = text(formData, "mealType");
  const capacity = integer(formData, "capacity");

  if (!validId(menuId)) return { status: "error", message: "Pilih menu yang valid." };
  if (!validDate(serviceDate) || serviceDate < jakartaDate()) return { status: "error", message: "Tanggal layanan tidak valid atau berada di masa lalu." };
  if (selectedMealType !== "lunch" && selectedMealType !== "dinner") return { status: "error", message: "Pilih waktu makan yang valid." };
  if (capacity < 1 || capacity > 10_000) return { status: "error", message: "Kapasitas harus antara 1–10.000 porsi." };

  const [menu] = await db.select({ id: menus.id, isActive: menus.isActive }).from(menus).where(eq(menus.id, menuId)).limit(1);
  if (!menu?.isActive) return { status: "error", message: "Menu yang dijadwalkan harus berstatus aktif." };

  await db
    .insert(menuSchedules)
    .values({ menuId, serviceDate, mealType: selectedMealType, capacity })
    .onConflictDoUpdate({
      target: [menuSchedules.serviceDate, menuSchedules.mealType],
      set: { menuId, capacity },
    });

  revalidatePath("/admin/menu");
  revalidatePath("/dashboard/menu");
  redirect("/admin/menu?saved=scheduled");
}

export async function deleteSchedule(formData: FormData) {
  await requireStaff();
  const scheduleId = text(formData, "scheduleId");
  if (!validId(scheduleId)) return;

  const [linkedOrder] = await db.select({ id: orders.id }).from(orders).where(eq(orders.menuScheduleId, scheduleId)).limit(1);
  if (linkedOrder) redirect("/admin/menu?error=schedule-in-use");

  await db.delete(menuSchedules).where(and(eq(menuSchedules.id, scheduleId)));
  revalidatePath("/admin/menu");
  redirect("/admin/menu?saved=schedule-deleted");
}
