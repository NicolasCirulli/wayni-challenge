import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Wayni Wallet",
  description: "Wayni Wallet",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable}`}>
        <div className="min-h-dvh antialiased bg-primary">
          {children}
        </div>
        <BottomNavigation />
      </body>
    </html>
  );
}
