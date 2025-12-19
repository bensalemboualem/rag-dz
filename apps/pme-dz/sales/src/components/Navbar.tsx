import React from "react";

/**
 * Navbar - Pack PME DZ Navigation
 * DESIGN SYSTEM: bg-background, text-foreground, text-muted-foreground, border-border
 * PRIMARY: text-primary (#00a651)
 */
export const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-primary via-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-xl">
              🏢
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent">
              Pack PME DZ
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <a href="#solution" className="text-muted-foreground hover:text-primary transition">
              Solution
            </a>
            <a href="#modules" className="text-muted-foreground hover:text-primary transition">
              Modules
            </a>
            <a href="#usecases" className="text-muted-foreground hover:text-primary transition">
              Exemples
            </a>
            <a href="#pricing" className="text-muted-foreground hover:text-primary transition">
              Tarifs
            </a>
            <a href="#faq" className="text-muted-foreground hover:text-primary transition">
              FAQ
            </a>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3">
            <a
              href="/cockpit/"
              className="px-4 py-2 text-muted-foreground border border-border rounded-lg hover:border-primary hover:text-primary transition"
            >
              Connexion
            </a>
            <a
              href="/cockpit/"
              className="px-4 py-2 bg-gradient-to-r from-primary via-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:opacity-90 transition"
            >
              Essai gratuit
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};
