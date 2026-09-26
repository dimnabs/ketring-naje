import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  ChefHat,
  HeartPulse,
  Leaf,
  MapPin,
  Salad,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Daily Balance",
    description: "Makan siang bernutrisi untuk hari kerja yang lebih ringan.",
    meals: "10 kali makan",
    price: "Rp450.000",
    accent: "bg-[#dce8d8]",
  },
  {
    name: "Complete Care",
    description: "Makan siang dan malam dengan porsi serta gizi terukur.",
    meals: "20 kali makan",
    price: "Rp840.000",
    accent: "bg-[#d8f36b]",
    featured: true,
  },
  {
    name: "Personal Nutrition",
    description: "Program khusus dengan peninjauan langsung ahli gizi.",
    meals: "Program 4 minggu",
    price: "Konsultasikan",
    accent: "bg-[#f7d8c2]",
  },
];

const weeklyMenu = [
  { day: "Sen", title: "Ayam panggang rempah", kcal: "485 kkal" },
  { day: "Sel", title: "Dori sambal matah", kcal: "510 kkal" },
  { day: "Rab", title: "Beef teriyaki sehat", kcal: "495 kkal" },
];

const features = [
  {
    icon: HeartPulse,
    title: "Berbasis ilmu",
    copy: "Menu disusun dengan prinsip gizi yang dapat dipertanggungjawabkan.",
  },
  {
    icon: Salad,
    title: "Tetap lezat",
    copy: "Makan sehat yang kaya rasa dan akrab di lidah Indonesia.",
  },
  {
    icon: CalendarDays,
    title: "Fleksibel",
    copy: "Atur jadwal, lewati hari, dan pantau paket dari satu tempat.",
  },
];

export default function Home() {
  return (
    <main className="overflow-hidden">
      <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 md:px-8">
        <Link href="/" className="flex items-center gap-2.5" aria-label="Naje Nutrition">
          <span className="grid size-10 place-items-center rounded-full bg-[#173f35] text-[#d8f36b]">
            <Leaf size={19} strokeWidth={2.4} />
          </span>
          <span className="leading-none">
            <strong className="display-font block text-xl">Naje</strong>
            <span className="text-[10px] font-semibold tracking-[0.22em] text-[#527066] uppercase">
              Nutrition
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
          <a href="#tentang" className="transition hover:text-[#668b42]">Tentang</a>
          <a href="#menu" className="transition hover:text-[#668b42]">Menu</a>
          <a href="#paket" className="transition hover:text-[#668b42]">Paket</a>
        </nav>

        <Link
          href="/login"
          className="rounded-full border border-[#173f35]/15 bg-white/70 px-5 py-2.5 text-sm font-semibold shadow-sm transition hover:bg-white"
        >
          Masuk
        </Link>
      </header>

      <section className="relative mx-auto grid min-h-[760px] max-w-7xl items-center gap-12 px-5 pb-20 pt-10 md:grid-cols-[1.05fr_.95fr] md:px-8 md:pt-14">
        <div className="relative z-10 max-w-2xl">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#173f35]/10 bg-white/70 px-4 py-2 text-xs font-bold tracking-wide text-[#365f53] uppercase shadow-sm">
            <Sparkles size={14} /> Disusun oleh Magister Ilmu Gizi
          </div>
          <h1 className="display-font text-[3.7rem] leading-[0.94] text-[#173f35] sm:text-7xl lg:text-[5.6rem]">
            Sehat itu bisa terasa <em className="font-normal text-[#799c49]">nikmat.</em>
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-[#527066]">
            Katering harian dengan menu seimbang, bahan segar, dan porsi yang dirancang sesuai kebutuhanmu—tanpa membuat hidup terasa rumit.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#173f35] px-7 py-4 font-bold text-white shadow-[0_14px_30px_rgba(23,63,53,.2)] transition hover:-translate-y-0.5 hover:bg-[#285c4c]"
            >
              Mulai hidup sehat <ArrowRight size={18} />
            </Link>
            <a href="#menu" className="inline-flex items-center justify-center rounded-full px-7 py-4 font-bold transition hover:bg-white/70">
              Lihat menu minggu ini
            </a>
          </div>
          <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-[#527066]">
            <span className="flex items-center gap-2"><BadgeCheck size={17} /> Gizi terukur</span>
            <span className="flex items-center gap-2"><BadgeCheck size={17} /> Tanpa pengawet</span>
            <span className="flex items-center gap-2"><BadgeCheck size={17} /> Bisa pause</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[560px]">
          <div className="absolute -left-12 top-12 size-52 rounded-full bg-[#d8f36b]/70 blur-2xl" />
          <div className="absolute -right-16 bottom-8 size-64 rounded-full bg-[#f29f67]/30 blur-3xl" />
          <div className="noise relative aspect-[4/5] overflow-hidden rounded-[3.5rem] bg-[#244f42] p-6 shadow-[0_35px_80px_rgba(23,63,53,.25)] sm:p-9">
            <div className="flex items-center justify-between text-white/80">
              <span className="text-xs font-bold tracking-[0.2em] uppercase">Pilihan hari ini</span>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs">485 kkal</span>
            </div>
            <div className="absolute inset-x-10 top-[22%] aspect-square rounded-full bg-[#fff9df] shadow-[inset_0_-18px_35px_rgba(190,152,73,.18),0_30px_50px_rgba(0,0,0,.2)]">
              <div className="absolute left-[12%] top-[18%] h-[32%] w-[45%] rotate-[-12deg] rounded-[45%_55%_45%_50%] bg-gradient-to-br from-[#db9b51] via-[#b96938] to-[#75402c] shadow-xl" />
              <div className="absolute bottom-[15%] left-[14%] h-[28%] w-[38%] rounded-full bg-[#f1ead1] shadow-inner" />
              <div className="absolute bottom-[19%] right-[12%] h-[24%] w-[30%] rotate-12 rounded-[55%_45%] bg-gradient-to-br from-[#82a83d] to-[#315d34]" />
              <div className="absolute right-[18%] top-[19%] size-[23%] rounded-full bg-[#e38a55] shadow-inner" />
              <div className="absolute left-[46%] top-[48%] h-[16%] w-[25%] rounded-full bg-[#f2c753]" />
            </div>
            <div className="absolute inset-x-8 bottom-8 rounded-[2rem] border border-white/10 bg-white/10 p-5 text-white backdrop-blur-md">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs text-white/60">Senin, 28 September</p>
                  <h2 className="display-font mt-1 text-2xl">Ayam rempah Nusantara</h2>
                </div>
                <ChefHat className="shrink-0 text-[#d8f36b]" />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 border-t border-white/10 pt-4 text-center text-xs">
                <div><strong className="block text-base">34g</strong>Protein</div>
                <div><strong className="block text-base">52g</strong>Karbo</div>
                <div><strong className="block text-base">15g</strong>Lemak</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="tentang" className="bg-[#173f35] px-5 py-24 text-white md:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <span className="text-xs font-bold tracking-[0.2em] text-[#d8f36b] uppercase">Kenapa Naje?</span>
            <h2 className="display-font mt-5 text-4xl leading-tight sm:text-5xl">Lebih dari sekadar menghitung kalori.</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            {features.map(({ icon: FeatureIcon, title, copy }) => (
              <article key={title} className="rounded-[2rem] border border-white/10 bg-white/[.06] p-6">
                <FeatureIcon className="text-[#d8f36b]" />
                <h3 className="mt-7 font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/60">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="menu" className="px-5 py-24 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <span className="text-xs font-bold tracking-[0.2em] text-[#668b42] uppercase">Menu minggu ini</span>
              <h2 className="display-font mt-4 text-4xl sm:text-5xl">Beda menu, setiap hari.</h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-[#527066]">Menu akan berganti mengikuti bahan terbaik yang tersedia, lengkap dengan informasi gizi.</p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {weeklyMenu.map((item, index) => (
              <article key={item.day} className="group rounded-[2rem] border border-[#173f35]/10 bg-white p-5 transition hover:-translate-y-1 hover:shadow-xl">
                <div className={`relative aspect-[4/3] overflow-hidden rounded-[1.4rem] ${index === 0 ? "bg-[#e6edcf]" : index === 1 ? "bg-[#f4d9c6]" : "bg-[#d7e5de]"}`}>
                  <div className="absolute left-1/2 top-1/2 size-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#fffaf0] shadow-[0_18px_35px_rgba(23,63,53,.16)]" />
                  <Salad className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[#557c3f]" size={62} strokeWidth={1.2} />
                  <span className="absolute left-4 top-4 grid size-10 place-items-center rounded-full bg-[#173f35] text-xs font-bold text-white">{item.day}</span>
                </div>
                <div className="flex items-center justify-between gap-4 px-1 pb-1 pt-5">
                  <h3 className="font-bold">{item.title}</h3>
                  <span className="shrink-0 text-xs text-[#668075]">{item.kcal}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="paket" className="px-5 pb-24 md:px-8">
        <div className="mx-auto max-w-7xl rounded-[3rem] bg-[#fffdf4] px-5 py-14 sm:px-10 lg:px-14">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-bold tracking-[0.2em] text-[#668b42] uppercase">Pilih ritmemu</span>
            <h2 className="display-font mt-4 text-4xl sm:text-5xl">Paket yang mengikuti hidupmu.</h2>
          </div>
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {plans.map((plan) => (
              <article key={plan.name} className={`relative rounded-[2rem] border border-[#173f35]/10 p-7 ${plan.accent} ${plan.featured ? "shadow-[0_20px_45px_rgba(23,63,53,.15)]" : ""}`}>
                {plan.featured && <span className="absolute right-5 top-5 rounded-full bg-[#173f35] px-3 py-1 text-[10px] font-bold tracking-wide text-white uppercase">Favorit</span>}
                <h3 className="display-font text-3xl">{plan.name}</h3>
                <p className="mt-4 min-h-12 text-sm leading-6 text-[#365f53]">{plan.description}</p>
                <div className="my-7 border-t border-[#173f35]/10" />
                <p className="text-xs font-bold tracking-wide uppercase">{plan.meals}</p>
                <p className="mt-2 text-2xl font-extrabold">{plan.price}</p>
                <Link href="/login" className="mt-7 flex items-center justify-center gap-2 rounded-full bg-[#173f35] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#285c4c]">
                  Pilih paket <ArrowRight size={16} />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-[#173f35]/10 px-5 py-10 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 text-sm text-[#527066] sm:flex-row sm:items-center">
          <div className="flex items-center gap-2 font-bold text-[#173f35]"><Leaf size={18} /> Naje Nutrition</div>
          <div className="flex items-center gap-2"><MapPin size={16} /> Indonesia · Area pengiriman segera hadir</div>
          <p>© {new Date().getFullYear()} Naje Nutrition</p>
        </div>
      </footer>
    </main>
  );
}
