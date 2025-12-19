"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Film, Layout, FolderOpen, CreditCard, Settings, Home } from "lucide-react";
import { clsx } from "clsx";

const navigation = [
  { name: "Studio", href: "/studio", icon: Film },
  { name: "Templates", href: "/templates", icon: Layout },
  { name: "Projets", href: "/projects", icon: FolderOpen },
  { name: "Crédits", href: "/credits", icon: CreditCard },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-surface flex flex-col">
        <div className="p-6 border-b border-border">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Film className="w-5 h-5 text-white" />
            </div>
            <span className="font-heading text-lg font-bold">Video Studio</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={clsx(
                  "flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors",
                  isActive
                    ? "bg-primary text-white"
                    : "text-text-muted hover:bg-surface-hover hover:text-text-primary"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-text-muted hover:bg-surface-hover hover:text-text-primary transition-colors"
          >
            <Home className="w-5 h-5" />
            Retour à l'accueil
          </Link>
          <Link
            href="/settings"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-text-muted hover:bg-surface-hover hover:text-text-primary transition-colors"
          >
            <Settings className="w-5 h-5" />
            Paramètres
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
