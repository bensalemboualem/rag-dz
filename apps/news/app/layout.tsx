import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "News DZ - Agrégateur Presse Algérienne",
  description: "Toute l'actualité algérienne en temps réel. Agrégation de 20+ sources de presse algérienne: El Watan, TSA, DZFoot, CompétitionDZ, et plus.",
  keywords: "actualité algérie, news dz, presse algérienne, el watan, tsa, dzfoot, sport algérie",
  authors: [{ name: "IA Factory" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  themeColor: "#007A3D",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark">
      <body className={inter.className}>
        {/* Header */}
        <header className="bg-gradient-to-r from-primary to-accent text-white shadow-lg sticky top-0 z-50">
          <div className="container-app py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center space-x-3">
                <span className="text-4xl">📰</span>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">News DZ</h1>
                  <p className="text-sm text-white/80">Presse Algérienne</p>
                </div>
              </Link>
              <div className="flex items-center space-x-4">
                <span className="hidden md:flex items-center space-x-2 px-4 py-2 bg-white/10 rounded-lg">
                  <span className="text-2xl">🇩🇿</span>
                  <span className="text-sm font-semibold">20+ Sources</span>
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-slate-900 text-white py-8">
          <div className="container-app">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
              <div>
                <h3 className="text-lg font-bold mb-3 flex items-center justify-center md:justify-start space-x-2">
                  <span>📰</span>
                  <span>News DZ</span>
                </h3>
                <p className="text-sm text-slate-400">
                  Agrégateur de presse algérienne. Toute l'actualité en temps réel.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-3">📚 Sources</h3>
                <p className="text-sm text-slate-400">
                  El Watan, TSA, DZFoot, CompétitionDZ, Algérie Eco, et 15+ autres sources
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-3">🔗 Liens</h3>
                <div className="space-y-2 text-sm">
                  <a href="/#general" className="block text-slate-400 hover:text-white transition-colors">
                    Actualités
                  </a>
                  <a href="/#sport" className="block text-slate-400 hover:text-white transition-colors">
                    Sport
                  </a>
                  <a href="/#economy" className="block text-slate-400 hover:text-white transition-colors">
                    Économie
                  </a>
                </div>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-slate-800 text-center text-sm text-slate-400">
              <p>🇩🇿 Made with ❤️ in Algeria | IA Factory</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
