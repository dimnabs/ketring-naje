import { and, eq } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { AppShell } from "@/components/app-shell";
import { db } from "@/lib/db";
import { addresses, users } from "@/lib/db/schema";

import { ProfileForm } from "./profile-form";

export const metadata: Metadata = { title: "Profil dan pengaturan" };

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ onboarding?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const [account] = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      phone: users.phone,
      profileCompleted: users.profileCompleted,
      dietaryPreferences: users.dietaryPreferences,
      allergies: users.allergies,
      dietaryNotes: users.dietaryNotes,
    })
    .from(users)
    .where(eq(users.email, session.user.email))
    .limit(1);

  if (!account?.email) redirect("/login");

  const [primaryAddress] = await db
    .select({
      label: addresses.label,
      addressLine: addresses.addressLine,
      city: addresses.city,
      postalCode: addresses.postalCode,
      deliveryNotes: addresses.deliveryNotes,
    })
    .from(addresses)
    .where(and(eq(addresses.userId, account.id), eq(addresses.isPrimary, true)))
    .limit(1);

  const { onboarding } = await searchParams;
  const showOnboarding = onboarding === "1" || !account.profileCompleted;

  return (
    <AppShell name={account.name} email={account.email} activeHref="/dashboard/pengaturan">
      <main className="mx-auto max-w-5xl px-5 py-8 sm:px-8 lg:py-12">
        {!showOnboarding ? (
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-[#668b42]"><ArrowLeft size={16} /> Ringkasan</Link>
        ) : (
          <span className="inline-flex rounded-full bg-[#d8f36b] px-3 py-1 text-xs font-bold uppercase tracking-wide">Langkah pertama</span>
        )}
        <div className="mt-5 max-w-2xl">
          <h1 className="display-font text-4xl sm:text-5xl">{showOnboarding ? "Kenalan dulu, yuk." : "Profil dan pengaturan"}</h1>
          <p className="mt-3 text-sm leading-6 text-[#6c8179] sm:text-base">
            {showOnboarding
              ? "Lengkapi data agar tim gizi dapat menyiapkan menu dan pengiriman yang sesuai kebutuhanmu."
              : "Perbarui data penerima, alamat utama, serta kebutuhan makanmu."}
          </p>
        </div>

        <div className="mt-8">
          <ProfileForm
            account={{
              name: account.name ?? "",
              email: account.email,
              phone: account.phone ?? "",
              dietaryPreferences: account.dietaryPreferences,
              allergies: account.allergies,
              dietaryNotes: account.dietaryNotes ?? "",
            }}
            address={{
              label: primaryAddress?.label ?? "Rumah",
              addressLine: primaryAddress?.addressLine ?? "",
              city: primaryAddress?.city ?? "",
              postalCode: primaryAddress?.postalCode ?? "",
              deliveryNotes: primaryAddress?.deliveryNotes ?? "",
            }}
          />
        </div>
      </main>
    </AppShell>
  );
}
