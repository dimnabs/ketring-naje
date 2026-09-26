import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

type StaffRole = "nutritionist" | "admin" | "owner";

export async function requireStaff(allowedRoles: StaffRole[] = ["nutritionist", "admin", "owner"]) {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const [account] = await db
    .select({ id: users.id, name: users.name, email: users.email, role: users.role })
    .from(users)
    .where(eq(users.email, session.user.email))
    .limit(1);

  if (!account || !allowedRoles.includes(account.role as StaffRole)) redirect("/dashboard");
  return account;
}
