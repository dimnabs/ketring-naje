"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { AdminActionState } from "@/lib/action-state";
import { requireStaff } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { plans } from "@/lib/db/schema";

function text(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function integer(formData: FormData, name: string) {
  const value = Number(text(formData, name));
  return Number.isSafeInteger(value) ? value : Number.NaN;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 100);
}

function validId(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function parsePlan(formData: FormData):
  | { ok: true; value: { name: string; slug: string; description: string | null; mealCredits: number; price: number } }
  | { ok: false; message: string } {
  const name = text(formData, "name");
  const slug = slugify(text(formData, "slug") || name);
  const description = text(formData, "description");
  const mealCredits = integer(formData, "mealCredits");
  const price = integer(formData, "price");

  if (name.length < 3 || name.length > 100) return { ok: false, message: "Nama paket harus terdiri dari 3–100 karakter." };
  if (!slug || slug.length > 100) return { ok: false, message: "Slug paket tidak valid." };
  if (description.length > 500) return { ok: false, message: "Deskripsi maksimal 500 karakter." };
  if (mealCredits < 1 || mealCredits > 365) return { ok: false, message: "Jumlah porsi harus antara 1 dan 365." };
  if (price < 1000 || price > 1_000_000_000) return { ok: false, message: "Harga paket tidak valid." };

  return { ok: true, value: { name, slug, description: description || null, mealCredits, price } };
}

function isUniqueViolation(error: unknown) {
  return typeof error === "object" && error !== null && "code" in error && error.code === "23505";
}

export async function createPlan(_state: AdminActionState, formData: FormData): Promise<AdminActionState> {
  await requireStaff(["admin", "owner"]);
  const parsed = parsePlan(formData);
  if (!parsed.ok) return { status: "error", message: parsed.message };

  try {
    await db.insert(plans).values(parsed.value);
  } catch (error) {
    if (isUniqueViolation(error)) return { status: "error", message: "Slug tersebut sudah digunakan paket lain." };
    return { status: "error", message: "Paket belum dapat disimpan. Coba kembali." };
  }

  revalidatePath("/admin/paket");
  redirect("/admin/paket?saved=created");
}

export async function updatePlan(planId: string, _state: AdminActionState, formData: FormData): Promise<AdminActionState> {
  await requireStaff(["admin", "owner"]);
  if (!validId(planId)) return { status: "error", message: "ID paket tidak valid." };
  const parsed = parsePlan(formData);
  if (!parsed.ok) return { status: "error", message: parsed.message };

  try {
    await db.update(plans).set({ ...parsed.value, updatedAt: new Date() }).where(eq(plans.id, planId));
  } catch (error) {
    if (isUniqueViolation(error)) return { status: "error", message: "Slug tersebut sudah digunakan paket lain." };
    return { status: "error", message: "Perubahan paket belum dapat disimpan." };
  }

  revalidatePath("/admin/paket");
  redirect("/admin/paket?saved=updated");
}

export async function setPlanActive(formData: FormData) {
  await requireStaff(["admin", "owner"]);
  const planId = text(formData, "planId");
  if (!validId(planId)) return;

  await db
    .update(plans)
    .set({ isActive: text(formData, "active") === "true", updatedAt: new Date() })
    .where(eq(plans.id, planId));

  revalidatePath("/admin/paket");
}
