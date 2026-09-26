"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { addresses, users } from "@/lib/db/schema";
import { allergyOptions, dietaryPreferenceOptions } from "@/lib/profile-options";

export type ProfileActionState = {
  status: "idle" | "error";
  message: string;
};

function readText(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function readAllowedValues(formData: FormData, name: string, allowed: ReadonlySet<string>) {
  return formData
    .getAll(name)
    .filter((value): value is string => typeof value === "string" && allowed.has(value));
}

function error(message: string): ProfileActionState {
  return { status: "error", message };
}

export async function saveProfile(
  _previousState: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const [account] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, session.user.email))
    .limit(1);

  if (!account) redirect("/login");

  const name = readText(formData, "name");
  const phone = readText(formData, "phone");
  const addressLabel = readText(formData, "addressLabel");
  const addressLine = readText(formData, "addressLine");
  const city = readText(formData, "city");
  const postalCode = readText(formData, "postalCode");
  const deliveryNotes = readText(formData, "deliveryNotes");
  const dietaryNotes = readText(formData, "dietaryNotes");

  const allowedPreferences = new Set(dietaryPreferenceOptions.map((option) => option.value));
  const allowedAllergies = new Set(allergyOptions.map((option) => option.value));
  const dietaryPreferences = readAllowedValues(formData, "dietaryPreferences", allowedPreferences);
  const allergies = readAllowedValues(formData, "allergies", allowedAllergies);

  if (name.length < 2 || name.length > 120) return error("Nama harus terdiri dari 2–120 karakter.");
  if (!/^[0-9+()\-\s]{8,24}$/.test(phone) || phone.replace(/\D/g, "").length < 8) {
    return error("Masukkan nomor WhatsApp yang valid.");
  }
  if (!addressLabel || addressLabel.length > 40) return error("Label alamat wajib diisi, maksimal 40 karakter.");
  if (addressLine.length < 10 || addressLine.length > 500) return error("Alamat lengkap harus terdiri dari 10–500 karakter.");
  if (city.length < 2 || city.length > 100) return error("Kota atau kabupaten harus terdiri dari 2–100 karakter.");
  if (postalCode && !/^\d{5}$/.test(postalCode)) return error("Kode pos harus terdiri dari 5 angka.");
  if (deliveryNotes.length > 500) return error("Catatan pengiriman maksimal 500 karakter.");
  if (dietaryNotes.length > 1000) return error("Catatan kebutuhan gizi maksimal 1.000 karakter.");

  await db.transaction(async (transaction) => {
    await transaction
      .update(users)
      .set({
        name,
        phone,
        dietaryPreferences,
        allergies,
        dietaryNotes: dietaryNotes || null,
        profileCompleted: true,
        updatedAt: new Date(),
      })
      .where(eq(users.id, account.id));

    const [primaryAddress] = await transaction
      .select({ id: addresses.id })
      .from(addresses)
      .where(and(eq(addresses.userId, account.id), eq(addresses.isPrimary, true)))
      .limit(1);

    const addressValues = {
      label: addressLabel,
      recipientName: name,
      recipientPhone: phone,
      addressLine,
      city,
      postalCode: postalCode || null,
      deliveryNotes: deliveryNotes || null,
      isPrimary: true,
    };

    if (primaryAddress) {
      await transaction.update(addresses).set(addressValues).where(eq(addresses.id, primaryAddress.id));
    } else {
      await transaction.insert(addresses).values({
        ...addressValues,
        userId: account.id,
      });
    }
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/pengaturan");
  redirect("/dashboard?profile=updated");
}
