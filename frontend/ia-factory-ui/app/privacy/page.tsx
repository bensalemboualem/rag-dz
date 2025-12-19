'use client'

import { useTenant } from '@/lib/providers/TenantProvider'
import { useTranslations } from 'next-intl'

export default function PrivacyPage() {
  const { tenant, flag, tagline } = useTenant()
  const t = useTranslations('common')

  if (tenant === 'switzerland') {
    return <SwissPrivacyPolicy flag={flag} tagline={tagline} />
  }

  return <AlgeriaPrivacyPolicy flag={flag} tagline={tagline} />
}

function SwissPrivacyPolicy({ flag, tagline }: { flag: string; tagline: string }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="text-6xl mb-4">{flag}</div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Politique de Confidentialité
          </h1>
          <p className="text-slate-400">{tagline}</p>
          <div className="mt-4 inline-block px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-lg">
            <span className="text-red-400 font-semibold">Conformité nLPD</span>
          </div>
        </div>

        {/* Content */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 space-y-8 text-slate-300">

          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
            <p className="leading-relaxed">
              Conformément à la nouvelle Loi fédérale sur la protection des données (nLPD) entrée en vigueur le 1er septembre 2023,
              IA Factory s'engage à protéger la vie privée et les données personnelles de ses utilisateurs en Suisse.
            </p>
          </section>

          {/* Responsable du traitement */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Responsable du Traitement</h2>
            <div className="bg-slate-900/50 p-4 rounded-lg">
              <p><strong className="text-white">IA Factory Switzerland</strong></p>
              <p>Adresse: [Votre adresse en Suisse]</p>
              <p>Contact: privacy@iafactory.ch</p>
              <p>Numéro IDE: [Votre numéro IDE]</p>
            </div>
          </section>

          {/* Données collectées */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Données Collectées</h2>
            <p className="mb-4">Nous collectons uniquement les données nécessaires à la fourniture de nos services:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Données d'inscription:</strong> Nom, prénom, adresse e-mail</li>
              <li><strong>Données de session:</strong> Enregistrements vocaux, transcriptions, analyses</li>
              <li><strong>Données techniques:</strong> Adresse IP, type de navigateur, langue</li>
              <li><strong>Données de facturation:</strong> Historique d'utilisation des tokens</li>
            </ul>
          </section>

          {/* Finalité */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Finalité du Traitement</h2>
            <p className="mb-4">Vos données sont traitées pour:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Fournir les services de transcription et d'analyse vocale</li>
              <li>Améliorer la qualité des analyses (détection de stress, émotions)</li>
              <li>Gérer votre compte et votre abonnement</li>
              <li>Assurer la sécurité et la conformité légale</li>
            </ul>
          </section>

          {/* Hébergement */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Hébergement et Sécurité</h2>
            <div className="bg-green-900/20 border border-green-500/30 p-4 rounded-lg">
              <p className="text-green-400 font-semibold mb-2">✓ Hébergement en Suisse</p>
              <p>Toutes vos données sont stockées exclusivement sur des serveurs situés en Suisse, garantissant une protection maximale
              conformément à la nLPD.</p>
            </div>
            <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
              <li>Chiffrement TLS/SSL pour toutes les communications</li>
              <li>Chiffrement au repos (AES-256) pour les données sensibles</li>
              <li>Authentification à deux facteurs disponible</li>
              <li>Sauvegardes automatiques quotidiennes</li>
            </ul>
          </section>

          {/* Durée de conservation */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Durée de Conservation</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Enregistrements:</strong> 12 mois (ou jusqu'à suppression manuelle)</li>
              <li><strong>Transcriptions:</strong> 24 mois</li>
              <li><strong>Données de compte:</strong> Durée de l'abonnement + 90 jours</li>
              <li><strong>Données de facturation:</strong> 10 ans (obligation légale)</li>
            </ul>
          </section>

          {/* Vos droits */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Vos Droits (nLPD)</h2>
            <p className="mb-4">Conformément à la nLPD, vous disposez des droits suivants:</p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-slate-900/50 p-4 rounded-lg">
                <h3 className="text-white font-semibold mb-2">✓ Droit d'accès</h3>
                <p className="text-sm">Obtenir une copie de toutes vos données personnelles</p>
              </div>
              <div className="bg-slate-900/50 p-4 rounded-lg">
                <h3 className="text-white font-semibold mb-2">✓ Droit de rectification</h3>
                <p className="text-sm">Corriger vos données inexactes</p>
              </div>
              <div className="bg-slate-900/50 p-4 rounded-lg">
                <h3 className="text-white font-semibold mb-2">✓ Droit à l'effacement</h3>
                <p className="text-sm">Supprimer définitivement vos données</p>
              </div>
              <div className="bg-slate-900/50 p-4 rounded-lg">
                <h3 className="text-white font-semibold mb-2">✓ Droit à la portabilité</h3>
                <p className="text-sm">Exporter vos données (JSON, PDF, DOCX)</p>
              </div>
            </div>
            <p className="mt-4">
              Pour exercer vos droits, contactez-nous à: <strong className="text-red-400">privacy@iafactory.ch</strong>
            </p>
          </section>

          {/* Transferts */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Transferts de Données</h2>
            <p>
              Vos données ne sont <strong className="text-white">jamais transférées hors de Suisse</strong> sans votre consentement explicite.
              En cas de besoin (ex: services d'IA externes), nous utilisons des garanties appropriées (clauses contractuelles types).
            </p>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. Cookies</h2>
            <p className="mb-2">Nous utilisons uniquement des cookies essentiels:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>auth_token:</strong> Authentification (1 semaine)</li>
              <li><strong>tenant_profile:</strong> Détection du profil utilisateur (session)</li>
            </ul>
            <p className="mt-2 text-sm">Aucun cookie de tracking ou publicitaire.</p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">10. Contact et Réclamations</h2>
            <p className="mb-4">
              Pour toute question ou réclamation concernant le traitement de vos données personnelles:
            </p>
            <div className="bg-slate-900/50 p-4 rounded-lg">
              <p><strong className="text-white">Délégué à la protection des données (DPO)</strong></p>
              <p>Email: dpo@iafactory.ch</p>
              <p>Téléphone: [Votre numéro]</p>
            </div>
            <p className="mt-4 text-sm">
              Vous avez également le droit de déposer une plainte auprès du
              <strong className="text-white"> Préposé fédéral à la protection des données et à la transparence (PFPDT)</strong>.
            </p>
          </section>

          {/* Footer */}
          <div className="pt-8 border-t border-slate-700 text-sm text-slate-500">
            <p>Dernière mise à jour: 16 décembre 2025</p>
            <p className="mt-2">
              Cette politique de confidentialité est conforme à la nLPD (Suisse) et au RGPD (UE).
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function AlgeriaPrivacyPolicy({ flag, tagline }: { flag: string; tagline: string }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" dir="ltr">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="text-6xl mb-4">{flag}</div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Politique de Confidentialité
          </h1>
          <p className="text-slate-400">{tagline}</p>
          <div className="mt-4 inline-block px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-lg">
            <span className="text-green-400 font-semibold">Protection des Données Éducatives</span>
          </div>
        </div>

        {/* Content */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 space-y-8 text-slate-300">

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
            <p className="leading-relaxed">
              IA Factory Algeria respecte la vie privée de ses utilisateurs et s'engage à protéger les données personnelles
              conformément aux lois algériennes sur la protection des données personnelles.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Données Collectées</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Informations d'inscription:</strong> Nom, prénom, adresse e-mail, établissement</li>
              <li><strong>Contenu éducatif:</strong> Enregistrements de cours, transcriptions, notes</li>
              <li><strong>Lexique personnel:</strong> Termes techniques, glossaire personnalisé</li>
              <li><strong>Données d'utilisation:</strong> Historique d'utilisation, préférences linguistiques (FR/AR)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Utilisation des Données</h2>
            <p className="mb-4">Vos données sont utilisées pour:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Fournir la transcription et l'analyse de vos cours</li>
              <li>Créer des résumés bilingues (FR/AR)</li>
              <li>Développer votre lexique personnel</li>
              <li>Améliorer nos algorithmes de reconnaissance vocale</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Sécurité et Hébergement</h2>
            <p className="mb-4">
              Toutes les données sont chiffrées (TLS/SSL) et stockées sur des serveurs sécurisés.
              Nous utilisons des protocoles de sécurité avancés pour protéger vos informations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Vos Droits</h2>
            <p className="mb-4">Vous avez le droit de:</p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-slate-900/50 p-4 rounded-lg">
                <h3 className="text-white font-semibold mb-2">✓ Accéder à vos données</h3>
                <p className="text-sm">Consulter toutes vos informations</p>
              </div>
              <div className="bg-slate-900/50 p-4 rounded-lg">
                <h3 className="text-white font-semibold mb-2">✓ Modifier vos données</h3>
                <p className="text-sm">Corriger les informations inexactes</p>
              </div>
              <div className="bg-slate-900/50 p-4 rounded-lg">
                <h3 className="text-white font-semibold mb-2">✓ Supprimer votre compte</h3>
                <p className="text-sm">Effacement complet de vos données</p>
              </div>
              <div className="bg-slate-900/50 p-4 rounded-lg">
                <h3 className="text-white font-semibold mb-2">✓ Exporter vos données</h3>
                <p className="text-sm">Format PDF, DOCX ou JSON</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Contact</h2>
            <div className="bg-slate-900/50 p-4 rounded-lg">
              <p><strong className="text-white">IA Factory Algeria</strong></p>
              <p>Email: contact@iafactoryalgeria.com</p>
              <p>Support: support@iafactoryalgeria.com</p>
            </div>
          </section>

          <div className="pt-8 border-t border-slate-700 text-sm text-slate-500">
            <p>Dernière mise à jour: 16 décembre 2025</p>
          </div>
        </div>
      </div>
    </div>
  )
}
