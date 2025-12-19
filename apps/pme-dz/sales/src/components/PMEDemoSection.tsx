import React, { useState } from "react";

const exampleQuestions = [
  {
    label: "💰 Impôts EURL services",
    question: "Quels impôts doit payer une petite EURL de services en Algérie ?",
  },
  {
    label: "📄 Embauche salarié",
    question: "Quels documents pour embaucher mon premier salarié ?",
  },
  {
    label: "👨‍💻 Freelance CASNOS",
    question: "Quelles sont mes obligations CNAS / CASNOS en tant que freelance ?",
  },
];

const demoResponses: Record<string, string> = {
  "Quels impôts doit payer une petite EURL de services en Algérie ?": `
    <strong>💰 Impôts pour une EURL de services en Algérie :</strong><br><br>
    <strong>1. IFU (Impôt Forfaitaire Unique)</strong> si CA < 8M DZD/an :<br>
    • Taux : 5% du CA pour les services<br>
    • Inclut IRG + TVA + TAP<br><br>
    <strong>2. Si régime réel :</strong><br>
    • IRG : barème progressif (0% à 35%)<br>
    • TVA : 19% sur les prestations<br>
    • TAP : 1% du CA<br><br>
    <strong>3. Cotisations sociales :</strong><br>
    • CASNOS : ~15% du revenu déclaré<br><br>
    📚 <em>Source : Code des impôts directs, LF 2024</em>
  `,
  "Quels documents pour embaucher mon premier salarié ?": `
    <strong>📄 Documents pour embaucher un salarié en Algérie :</strong><br><br>
    <strong>Du côté employeur :</strong><br>
    • Registre de commerce à jour<br>
    • NIF (Numéro d'Identification Fiscale)<br>
    • Affiliation CNAS employeur<br>
    • Contrat de travail (CDD ou CDI)<br><br>
    <strong>Du côté salarié :</strong><br>
    • CNI ou passeport<br>
    • Extrait de naissance n°12<br>
    • Photos d'identité<br>
    • Certificats de travail antérieurs<br>
    • Diplômes (si requis)<br><br>
    <strong>Démarches :</strong><br>
    • Déclaration CNAS (DAS) dans les 10 jours<br>
    • Déclaration à l'inspection du travail<br><br>
    📚 <em>Source : Code du travail algérien, Art. 11-19</em>
  `,
  "Quelles sont mes obligations CNAS / CASNOS en tant que freelance ?": `
    <strong>👨‍💻 Obligations sociales pour freelance en Algérie :</strong><br><br>
    <strong>CASNOS (obligatoire) :</strong><br>
    • Affiliation obligatoire pour non-salariés<br>
    • Cotisation : ~15% du revenu déclaré<br>
    • Minimum : basé sur le SNMG<br>
    • Couverture : maladie, retraite, invalidité<br><br>
    <strong>CNAS :</strong><br>
    • Uniquement si vous avez des salariés<br>
    • Taux employeur : 26% du salaire brut<br>
    • Taux salarié : 9% (retenu à la source)<br><br>
    <strong>Déclarations :</strong><br>
    • CASNOS : déclaration annuelle des revenus<br>
    • Paiement trimestriel recommandé<br><br>
    📚 <em>Source : Loi 83-14 sur la sécurité sociale</em>
  `,
};

const defaultResponse = `
  <strong>🤖 Réponse de l'assistant PME DZ :</strong><br><br>
  Merci pour votre question ! En tant qu'assistant spécialisé pour les PME algériennes, 
  je peux vous aider sur :<br><br>
  • <strong>Fiscalité</strong> : IRG, TVA, IFU, IBS, TAP...<br>
  • <strong>Social</strong> : CNAS, CASNOS, embauche...<br>
  • <strong>Juridique</strong> : CNRC, statuts, contrats...<br>
  • <strong>Documents</strong> : modèles, courriers...<br><br>
  <em>Pour une réponse détaillée et personnalisée, créez votre compte gratuit !</em>
`;

interface Message {
  type: "user" | "ai";
  content: string;
}

export const PMEDemoSection: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      type: "ai",
      content:
        "Bonjour ! Je suis l'assistant IA spécialisé pour les PME en Algérie. Posez-moi une question sur la fiscalité, le juridique, ou les démarches administratives.",
    },
  ]);
  const [input, setInput] = useState("");
  const [queryCount, setQueryCount] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const maxQueries = 3;

  const handleSend = () => {
    if (!input.trim() || queryCount >= maxQueries) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { type: "user", content: userMessage }]);
    setInput("");
    setQueryCount((prev) => prev + 1);
    setIsTyping(true);

    setTimeout(() => {
      const response = demoResponses[userMessage] || defaultResponse;
      setMessages((prev) => [...prev, { type: "ai", content: response }]);
      setIsTyping(false);
    }, 1500);
  };

  const handleExampleClick = (question: string) => {
    setInput(question);
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      {/* Section Header */}
      <div className="text-center mb-12">
        <span className="inline-block px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-full text-purple-500 text-sm font-medium mb-4">
          🎯 Essayez maintenant
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Testez l'
          <span className="bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
            assistant PME
          </span>{" "}
          en direct
        </h2>
        <p className="text-gray-400 max-w-xl mx-auto">
          Posez une question sur la fiscalité, le juridique ou l'administratif algérien — l'IA vous
          répond instantanément.
        </p>
      </div>

      {/* Demo Chat Box */}
      <div className="bg-background rounded-2xl border border-border p-6 shadow-2xl">
        {/* Chat Header */}
        <div className="flex items-center gap-3 pb-4 mb-4 border-b border-gray-700">
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
            🤖
          </div>
          <div>
            <div className="font-semibold">Assistant PME DZ</div>
            <div className="text-xs text-green-500 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              En ligne
            </div>
          </div>
        </div>

        {/* Example Questions */}
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-3">💡 Cliquez sur un exemple pour tester :</p>
          <div className="flex flex-wrap gap-2">
            {exampleQuestions.map((eq, index) => (
              <button
                key={index}
                onClick={() => handleExampleClick(eq.question)}
                className="px-3 py-2 bg-muted rounded-lg border border-border text-sm text-muted-foreground hover:border-primary hover:text-primary transition text-left"
              >
                {eq.label}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Messages Area */}
        <div className="bg-muted rounded-xl p-4 min-h-[200px] max-h-[300px] overflow-y-auto mb-4 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex gap-3 ${msg.type === "user" ? "justify-end" : ""}`}
            >
              {msg.type === "ai" && (
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-sm shrink-0">
                  🤖
                </div>
              )}
              <div
                className={`rounded-xl p-3 text-sm max-w-[85%] ${
                  msg.type === "user"
                    ? "bg-green-500/20 border border-green-500/30 rounded-tr-none text-gray-200"
                    : "bg-gray-700/50 rounded-tl-none text-gray-300"
                }`}
                dangerouslySetInnerHTML={{ __html: msg.content }}
              />
              {msg.type === "user" && (
                <div className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center text-sm shrink-0">
                  👤
                </div>
              )}
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-sm shrink-0">
                🤖
              </div>
              <div className="bg-gray-700/50 rounded-xl rounded-tl-none p-3 text-sm text-gray-400">
                <span className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <span
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  />
                  <span
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  />
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            disabled={queryCount >= maxQueries}
            className="flex-1 px-4 py-3 bg-muted border-2 border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition disabled:opacity-50"
            placeholder={
              queryCount >= maxQueries
                ? "Créez un compte pour continuer..."
                : "Posez votre question sur les PME en Algérie..."
            }
          />
          <button
            onClick={handleSend}
            disabled={queryCount >= maxQueries || !input.trim()}
            className="px-6 py-3 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:opacity-90 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {queryCount >= maxQueries ? "🔒 Limite" : "Envoyer"}
          </button>
        </div>

        {/* Demo Limit Notice */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            ⚠️ Version de démonstration limitée à 3 questions •{" "}
            <a href="/cockpit/" className="text-primary hover:underline">
              Créer un compte
            </a>{" "}
            pour un accès illimité
          </p>
        </div>
      </div>
    </div>
  );
};
