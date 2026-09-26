import {
  CalendarDays,
  CreditCard,
  LayoutDashboard,
  Leaf,
  LogOut,
  PackageOpen,
  Settings,
  ShoppingBag,
  Users,
  UtensilsCrossed,
} from "lucide-react";
import Link from "next/link";

import { signOut } from "@/auth";

type AppShellProps = {
  children: React.ReactNode;
  name?: string | null;
  email?: string | null;
  mode?: "customer" | "admin";
  activeHref?: string;
};

const customerLinks = [
  { label: "Ringkasan", href: "/dashboard", icon: LayoutDashboard },
  { label: "Menu saya", href: "/dashboard/menu", icon: UtensilsCrossed },
  { label: "Jadwal", href: "/dashboard/jadwal", icon: CalendarDays },
  { label: "Pembayaran", href: "/dashboard/pembayaran", icon: CreditCard },
  { label: "Pengaturan", href: "/dashboard/pengaturan", icon: Settings },
];

const adminLinks = [
  { label: "Operasional", href: "/admin", icon: LayoutDashboard },
  { label: "Pesanan", href: "/admin/pesanan", icon: ShoppingBag },
  { label: "Menu", href: "/admin/menu", icon: UtensilsCrossed },
  { label: "Pelanggan", href: "/admin/pelanggan", icon: Users },
  { label: "Paket", href: "/admin/paket", icon: PackageOpen },
];

export function AppShell({ children, name, email, mode = "customer", activeHref }: AppShellProps) {
  const links = mode === "admin" ? adminLinks : customerLinks;
  const selectedHref = activeHref ?? (mode === "admin" ? "/admin" : "/dashboard");

  return (
    <div className="min-h-screen bg-[#f3f5ef] lg:grid lg:grid-cols-[270px_1fr]">
      <aside className="hidden min-h-screen flex-col bg-[#173f35] p-6 text-white lg:flex">
        <Link href="/" className="flex items-center gap-2.5 px-2">
          <span className="grid size-10 place-items-center rounded-full bg-[#d8f36b] text-[#173f35]">
            <Leaf size={19} strokeWidth={2.4} />
          </span>
          <span>
            <strong className="display-font block text-xl leading-none">Naje</strong>
            <span className="text-[9px] font-semibold tracking-[.22em] text-white/50 uppercase">Nutrition</span>
          </span>
        </Link>

        <p className="mb-3 mt-12 px-3 text-[10px] font-bold tracking-[.2em] text-white/35 uppercase">
          {mode === "admin" ? "Admin workspace" : "Akun saya"}
        </p>
        <nav className="space-y-1">
          {links.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${selectedHref === href ? "bg-white/10 text-white" : "text-white/55 hover:bg-white/[.06] hover:text-white"}`}
            >
              <Icon size={18} /> {label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto rounded-2xl border border-white/10 bg-white/[.05] p-4">
          <p className="truncate text-sm font-semibold">{name ?? "Pengguna Naje"}</p>
          <p className="mt-1 truncate text-xs text-white/45">{email}</p>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button className="mt-4 flex items-center gap-2 text-xs font-semibold text-[#d8f36b]" type="submit">
              <LogOut size={14} /> Keluar
            </button>
          </form>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="flex items-center justify-between border-b border-[#173f35]/10 bg-white/70 px-5 py-4 backdrop-blur lg:hidden">
          <Link href="/" className="flex items-center gap-2 font-bold"><Leaf size={18} /> Naje</Link>
          <span className="text-xs font-semibold text-[#527066]">{mode === "admin" ? "Admin" : name}</span>
        </header>
        {children}
      </div>
    </div>
  );
}
