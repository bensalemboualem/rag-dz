'use client'

import { useTenant } from '@/lib/providers/TenantProvider'

export default function MentionsLegalesPage() {
  const { flag, tagline } = useTenant()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="text-6xl mb-4">{flag}</div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Mentions Légales
          </h1>
          <p className="text-slate-400">{tagline}</p>
        </div>

        {/* Content */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 space-y-8 text-slate-300">

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Éditeur du Site</h2>
            <div className="bg-slate-900/50 p-4 rounded-lg">
              <p><strong className="text-white">Raison sociale:</strong> IA Factory Algeria</p>
              <p><strong className="text-white">Forme juridique:</strong> SARL (Société à Responsabilité Limitée)</p>
              <p><strong className="text-white">Capital social:</strong> [À compléter]</p>
              <p><strong className="text-white">Siège social:</strong> [Votre adresse complète en Algérie]</p>
              <p><strong className="text-white">NIS:</strong> [Numéro d'Identification Statistique]</p>
              <p><strong className="text-white">NIF:</strong> [Numéro d'Identification Fiscale]</p>
              <p><strong className="text-white">RC:</strong> [Registre du Commerce]</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Directeur de la Publication</h2>
            <div className="bg-slate-900/50 p-4 rounded-lg">
              <p><strong className="text-white">Nom:</strong> [Nom du directeur]</p>
              <p><strong className="text-white">Qualité:</strong> Gérant</p>
              <p><strong className="text-white">Email:</strong> contact@iafactoryalgeria.com</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Hébergement</h2>
            <div className="bg-slate-900/50 p-4 rounded-lg">
              <p><strong className="text-white">Hébergeur:</strong> Hetzner Online GmbH</p>
              <p><strong className="text-white">Adresse:</strong> Industriestr. 25, 91710 Gunzenhausen, Allemagne</p>
              <p><strong className="text-white">Téléphone:</strong> +49 (0)9831 505-0</p>
              <p><strong className="text-white">Site web:</strong> www.hetzner.com</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Propriété Intellectuelle</h2>
            <p className="mb-4">
              L'ensemble de ce site relève de la législation algérienne et internationale sur le droit d'auteur
              et la propriété intellectuelle. Tous les droits de reproduction sont réservés.
            </p>
            <p>
              Les marques, logos, signes ainsi que tous les contenus du site (textes, images, son, vidéo...)
              font l'objet d'une protection par le Code de la propriété intellectuelle et plus particulièrement
              par le droit d'auteur.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Protection des Données Personnelles</h2>
            <p className="mb-4">
              IA Factory Algeria s'engage à respecter la confidentialité de vos données personnelles
              conformément à la législation algérienne en vigueur.
            </p>
            <p>
              Pour plus d'informations, consultez notre{' '}
              <a href="/privacy" className="text-green-400 hover:underline">
                Politique de Confidentialité
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Cookies</h2>
            <p>
              Le site utilise uniquement des cookies essentiels au fonctionnement de l'application
              (authentification, préférences utilisateur). Aucun cookie de tracking ou publicitaire
              n'est utilisé.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Droit Applicable</h2>
            <p>
              Les présentes mentions légales sont régies par le droit algérien.
              En cas de litige, les tribunaux algériens seront seuls compétents.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Contact</h2>
            <div className="bg-slate-900/50 p-4 rounded-lg">
              <p><strong className="text-white">Email:</strong> legal@iafactoryalgeria.com</p>
              <p><strong className="text-white">Téléphone:</strong> [Votre numéro de téléphone]</p>
              <p><strong className="text-white">Adresse:</strong> [Votre adresse complète]</p>
            </div>
          </section>

          <div className="pt-8 border-t border-slate-700 text-sm text-slate-500">
            <p>Dernière mise à jour: 17 décembre 2025</p>
          </div>
        </div>
      </div>
    </div>
  )
}
