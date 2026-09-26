import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Naje Nutrition",
    template: "%s | Naje Nutrition",
  },
  description:
    "Katering bergizi yang dirancang oleh ahli gizi untuk rutinitas sehat yang lebih mudah.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className="h-full scroll-smooth" data-scroll-behavior="smooth">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
