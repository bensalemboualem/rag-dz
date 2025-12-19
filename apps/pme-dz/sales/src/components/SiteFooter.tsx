import React from "react";

interface FooterLink {
  label: string;
  href: string;
  badge?: string;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

const footerColumns: FooterColumn[] = [
  {
    title: "Solutions PME",
    links: [
      { label: "Pack PME DZ", href: "/pme", badge: "Nouveau" },
      { label: "Module Fiscal", href: "/modules/fiscal" },
      { label: "Module Juridique", href: "/modules/juridique" },
      { label: "Assistant IA", href: "/chat" },
      { label: "CRM Intégré", href: "/modules/crm" },
      { label: "Documents Auto", href: "/modules/documents" },
    ],
  },
  {
    title: "Ressources",
    links: [
      { label: "Guide fiscal 2025", href: "/ressources/guide-fiscal-2025" },
      { label: "Modèles de contrats", href: "/ressources/modeles" },
      { label: "FAQ PME", href: "/faq" },
      { label: "Blog", href: "/blog" },
      { label: "Webinaires", href: "/webinaires" },
      { label: "Communauté", href: "/communaute" },
    ],
  },
  {
    title: "iaFactory",
    links: [
      { label: "À propos", href: "/a-propos" },
      { label: "Équipe", href: "/equipe" },
      { label: "Partenaires", href: "/partenaires" },
      { label: "Carrières", href: "/carrieres", badge: "On recrute" },
      { label: "Contact", href: "/contact" },
      { label: "Presse", href: "/presse" },
    ],
  },
  {
    title: "Légal",
    links: [
      { label: "CGU", href: "/cgu" },
      { label: "Politique de confidentialité", href: "/confidentialite" },
      { label: "Mentions légales", href: "/mentions-legales" },
      { label: "Cookies", href: "/cookies" },
      { label: "RGPD & Protection des données", href: "/rgpd" },
    ],
  },
];

export const SiteFooter: React.FC = () => {
  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main footer grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1 mb-8 lg:mb-0">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-primary via-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                🇩🇿
              </div>
              <span className="text-foreground font-bold text-xl">
                Pack PME <span className="text-primary">DZ</span>
              </span>
            </div>

            {/* Description */}
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              L'assistant IA conçu pour les PME, freelances et commerçants algériens. Simplifiez
              votre fiscalité, juridique et gestion quotidienne.
            </p>

            {/* Social links */}
            <div className="flex gap-4">
              <a
                href="https://linkedin.com/company/iafactoryalgeria"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center text-muted-foreground hover:bg-blue-600 hover:text-white transition"
                aria-label="LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              <a
                href="https://twitter.com/iafactorydz"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted/80 hover:text-white transition"
                aria-label="Twitter/X"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://facebook.com/iafactoryalgeria"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center text-muted-foreground hover:bg-blue-700 hover:text-white transition"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://instagram.com/iafactoryalgeria"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center text-muted-foreground hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white transition"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Footer columns */}
          {footerColumns.map((column) => (
            <div key={column.title}>
              <h4 className="text-foreground font-semibold mb-4">{column.title}</h4>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-muted-foreground hover:text-primary transition text-sm flex items-center gap-2"
                    >
                      {link.label}
                      {link.badge && (
                        <span className="px-2 py-0.5 bg-primary/20 text-primary text-xs rounded-full">
                          {link.badge}
                        </span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* SEO internal links */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-muted-foreground text-sm text-center">
            <strong className="text-foreground">Thematiques populaires :</strong>{" "}
            <a href="/sujets/ifu-algerie" className="hover:text-primary transition">
              IFU Algérie
            </a>{" "}
            •{" "}
            <a href="/sujets/casnos-freelance" className="hover:text-primary transition">
              CASNOS Freelance
            </a>{" "}
            •{" "}
            <a href="/sujets/tva-algerie" className="hover:text-primary transition">
              TVA Algérie
            </a>{" "}
            •{" "}
            <a href="/sujets/creation-eurl" className="hover:text-primary transition">
              Création EURL
            </a>{" "}
            •{" "}
            <a href="/sujets/registre-commerce" className="hover:text-primary transition">
              Registre de Commerce
            </a>{" "}
            •{" "}
            <a href="/sujets/contrat-travail-cdd" className="hover:text-primary transition">
              Contrat CDD
            </a>{" "}
            •{" "}
            <a href="/sujets/import-export-algerie" className="hover:text-primary transition">
              Import/Export
            </a>
          </p>
        </div>

        {/* Contact bar */}
        <div className="mt-8 flex flex-wrap justify-center gap-6 text-muted-foreground text-sm">
          <a
            href="mailto:contact@iafactoryalgeria.com"
            className="flex items-center gap-2 hover:text-primary transition"
          >
            <span>📧</span>
            contact@iafactoryalgeria.com
          </a>
          <a
            href="tel:+213555123456"
            className="flex items-center gap-2 hover:text-primary transition"
          >
            <span>📞</span>
            +213 555 123 456
          </a>
          <span className="flex items-center gap-2">
            <span>📍</span>
            Alger, Algérie
          </span>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © 2025 iaFactory Algeria. Tous droits réservés.
          </p>
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full border border-primary/20">
              🇩🇿 Made in Algeria
            </span>
            <span className="px-3 py-1 bg-blue-500/10 text-blue-500 text-xs rounded-full border border-blue-500/20">
              🔒 RGPD Compliant
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
