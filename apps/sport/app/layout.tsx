import type { Metadata } from "next";
import "./globals.css";
import { Trophy, Newspaper, Users, Globe } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sport Magazine DZ - 100% Algérie",
  description: "Toute l'actualité sportive algérienne : Fennecs, Ligue 1, joueurs à l'étranger et sport international",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>
        {/* Header */}
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
          <div className="container-app">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link href="/" className="flex items-center space-x-2">
                <Trophy className="w-8 h-8 text-primary" />
                <div>
                  <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                    Sport Magazine DZ
                  </h1>
                  <p className="text-xs text-slate-500">100% Algérie 🇩🇿</p>
                </div>
              </Link>

              {/* Navigation */}
              <nav className="hidden md:flex items-center space-x-6">
                <Link
                  href="/articles/fennecs"
                  className="flex items-center space-x-1 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"
                >
                  <Trophy className="w-4 h-4" />
                  <span>Fennecs</span>
                </Link>
                <Link
                  href="/articles/ligue1"
                  className="flex items-center space-x-1 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"
                >
                  <Newspaper className="w-4 h-4" />
                  <span>Ligue 1</span>
                </Link>
                <Link
                  href="/articles/international"
                  className="flex items-center space-x-1 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  <span>International</span>
                </Link>
                <Link
                  href="/can2025"
                  className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                >
                  CAN 2025 🏆
                </Link>
              </nav>
            </div>
          </div>
        </header>

        {/* Main */}
        <main className="min-h-screen">{children}</main>

        {/* Footer */}
        <footer className="bg-slate-900 text-white py-8 mt-16">
          <div className="container-app">
            <div className="text-center">
              <p className="text-slate-400">
                © 2025 Sport Magazine DZ - Made with ❤️ in Algeria 🇩🇿
              </p>
              <p className="text-sm text-slate-500 mt-2">
                IA Factory - Toute l'actualité sportive algérienne
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
