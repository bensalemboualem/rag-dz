'use client'

import { useTenant } from '@/lib/providers/TenantProvider'

export default function TermsPage() {
  const { tenant, flag, tagline } = useTenant()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="text-6xl mb-4">{flag}</div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Conditions d'Utilisation
          </h1>
          <p className="text-slate-400">{tagline}</p>
        </div>

        {/* Content */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 space-y-8 text-slate-300">

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Acceptation des Conditions</h2>
            <p className="leading-relaxed">
              En utilisant IA Factory ({tenant === 'switzerland' ? 'iafactory.ch' : 'iafactoryalgeria.com'}),
              vous acceptez d'être lié par ces conditions d'utilisation. Si vous n'acceptez pas ces conditions,
              veuillez ne pas utiliser nos services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Description du Service</h2>
            <p className="mb-4">IA Factory fournit:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Transcription vocale automatique multilingue</li>
              <li>Analyse de contenu (émotions, stress, résumés)</li>
              {tenant === 'switzerland' && (
                <>
                  <li>Outils spécialisés pour professionnels de la santé mentale</li>
                  <li>Conformité nLPD pour données sensibles</li>
                </>
              )}
              {tenant === 'algeria' && (
                <>
                  <li>Résumés bilingues (Français/Arabe)</li>
                  <li>Lexique personnel pour l'éducation</li>
                </>
              )}
              <li>Export de données (PDF, DOCX, JSON)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Compte Utilisateur</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-white font-semibold mb-2">3.1 Inscription</h3>
                <p>Vous devez fournir des informations exactes et à jour lors de l'inscription. Vous êtes responsable
                de la confidentialité de vos identifiants.</p>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">3.2 Âge Minimum</h3>
                <p>Vous devez avoir au moins 18 ans pour utiliser ce service. Si vous avez entre 13 et 18 ans,
                l'accord d'un parent ou tuteur est requis.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Système de Tokens</h2>
            <div className="bg-slate-900/50 p-4 rounded-lg mb-4">
              <p className="mb-2"><strong className="text-white">Tokens Gratuits:</strong> 100 tokens offerts à l'inscription</p>
              <p><strong className="text-white">Consommation:</strong> ~10 tokens par minute d'enregistrement</p>
            </div>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Les tokens ne sont pas remboursables</li>
              <li>Les tokens expirés ne peuvent pas être récupérés</li>
              <li>Vous pouvez acheter des tokens supplémentaires à tout moment</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Utilisation Acceptable</h2>
            <p className="mb-4">Vous vous engagez à ne pas:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Utiliser le service à des fins illégales ou frauduleuses</li>
              <li>Uploader du contenu offensant, haineux ou illégal</li>
              <li>Tenter de contourner les limites de tokens</li>
              <li>Partager votre compte avec d'autres personnes</li>
              <li>Utiliser des outils automatisés pour abuser du service</li>
              <li>Revendre ou redistribuer le service sans autorisation</li>
            </ul>
          </section>

          {tenant === 'switzerland' && (
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. Confidentialité Professionnelle</h2>
              <div className="bg-red-900/20 border border-red-500/30 p-4 rounded-lg">
                <p className="text-red-300 mb-2">
                  <strong>⚠️ Important pour les professionnels de la santé:</strong>
                </p>
                <p>
                  Vous êtes responsable de l'anonymisation des données patients avant upload.
                  IA Factory ne peut garantir la conformité avec les obligations de secret professionnel si vous
                  uploadez des données non anonymisées.
                </p>
              </div>
            </section>
          )}

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">{tenant === 'switzerland' ? '7' : '6'}. Propriété Intellectuelle</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-white font-semibold mb-2">Vos Contenus</h3>
                <p>Vous conservez la propriété de tous les enregistrements et transcriptions que vous créez.
                Vous nous accordez une licence limitée pour traiter ces contenus afin de fournir le service.</p>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">Notre Plateforme</h3>
                <p>Tous les éléments de la plateforme IA Factory (code, design, algorithmes) sont notre propriété exclusive.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">{tenant === 'switzerland' ? '8' : '7'}. Limitation de Responsabilité</h2>
            <div className="bg-yellow-900/20 border border-yellow-500/30 p-4 rounded-lg">
              <p className="mb-2">
                IA Factory fournit le service "tel quel" sans garantie de disponibilité à 100%.
                Nous ne sommes pas responsables:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-sm">
                <li>Des pertes de données dues à des pannes techniques</li>
                <li>Des erreurs de transcription ou d'analyse</li>
                <li>Des décisions prises sur la base de nos analyses</li>
                {tenant === 'switzerland' && <li>De l'utilisation clinique sans validation humaine</li>}
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">{tenant === 'switzerland' ? '9' : '8'}. Résiliation</h2>
            <p className="mb-4">Nous nous réservons le droit de suspendre ou résilier votre compte en cas de:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Violation de ces conditions d'utilisation</li>
              <li>Activité suspecte ou frauduleuse</li>
              <li>Non-paiement (pour les abonnements payants)</li>
              <li>Inactivité prolongée (plus de 24 mois)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">{tenant === 'switzerland' ? '10' : '9'}. Modifications</h2>
            <p>
              Nous nous réservons le droit de modifier ces conditions à tout moment.
              Les modifications seront notifiées par e-mail 30 jours avant leur entrée en vigueur.
              Continuer à utiliser le service après cette période constitue une acceptation des nouvelles conditions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">{tenant === 'switzerland' ? '11' : '10'}. Droit Applicable</h2>
            <p>
              {tenant === 'switzerland' ? (
                <>
                  Ces conditions sont régies par le droit suisse.
                  Tout litige sera soumis à la juridiction exclusive des tribunaux de Genève, Suisse.
                </>
              ) : (
                <>
                  Ces conditions sont régies par le droit algérien.
                  Tout litige sera soumis à la juridiction des tribunaux compétents d'Algérie.
                </>
              )}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">{tenant === 'switzerland' ? '12' : '11'}. Contact</h2>
            <div className="bg-slate-900/50 p-4 rounded-lg">
              <p>Pour toute question concernant ces conditions:</p>
              <p className="mt-2">
                <strong className="text-white">Email:</strong> {tenant === 'switzerland' ? 'legal@iafactory.ch' : 'legal@iafactoryalgeria.com'}
              </p>
            </div>
          </section>

          <div className="pt-8 border-t border-slate-700 text-sm text-slate-500">
            <p>Dernière mise à jour: 16 décembre 2025</p>
            <p className="mt-2">Version 1.0</p>
          </div>
        </div>
      </div>
    </div>
  )
}
