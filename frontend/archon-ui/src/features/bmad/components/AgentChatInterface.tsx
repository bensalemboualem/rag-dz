import { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, AlertCircle } from 'lucide-react';
import type { BMADAgent } from '../types';
import { bmadChatService, type ChatMessage } from '../services/bmadChatService';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AgentChatInterfaceProps {
  agent: BMADAgent;
  onClose: () => void;
}

export function AgentChatInterface({ agent, onClose }: AgentChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize conversation with agent's greeting
  useEffect(() => {
    const initializeConversation = async () => {
      try {
        setIsInitializing(true);

        // Send empty message to get agent's greeting
        const response = await bmadChatService.chat({
          agent_id: agent.id,
          messages: [],
          temperature: 0.7,
        });

        const greetingMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: response.message,
          timestamp: new Date(),
        };

        setMessages([greetingMessage]);
      } catch (err) {
        console.error('Error initializing conversation:', err);
        setError('Impossible de se connecter à l\'agent. Vérifie que le backend est démarré.');

        // Fallback greeting
        const fallbackMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: `👋 Salut! Je suis ${agent.name} (${agent.icon}), ${agent.description}.\n\nComment puis-je t'aider aujourd'hui?`,
          timestamp: new Date(),
        };
        setMessages([fallbackMessage]);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeConversation();
  }, [agent]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      // Convert messages to API format
      const chatMessages: ChatMessage[] = [
        ...messages.map(m => ({
          role: m.role,
          content: m.content,
        })),
        {
          role: 'user' as const,
          content: currentInput,
        },
      ];

      // Call real Claude API
      const response = await bmadChatService.chat({
        agent_id: agent.id,
        messages: chatMessages,
        temperature: 0.7,
      });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.message,
        timestamp: new Date(response.timestamp),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error getting agent response:', error);
      setError('Erreur lors de la communication avec l\'agent. Réessaie.');

      // Remove user message on error
      setMessages(prev => prev.filter(m => m.id !== userMessage.id));
      setInput(currentInput); // Restore input
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl w-full max-w-4xl h-[80vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-4">
            <div className="text-5xl">{agent.icon}</div>
            <div>
              <h2 className="text-2xl font-bold text-white">{agent.name}</h2>
              <p className="text-gray-400 text-sm">{agent.description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
          >
            ✕
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Error Banner */}
          {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}

          {/* Initializing State */}
          {isInitializing && (
            <div className="flex justify-center items-center h-32">
              <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
            </div>
          )}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
              )}

              <div
                className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-blue-600 to-blue-500 text-white'
                    : 'bg-gradient-to-br from-gray-800 to-gray-700 text-gray-100 border border-gray-600'
                }`}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
                <div className="text-xs opacity-60 mt-2">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>

              {message.role === 'user' && (
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div className="bg-gradient-to-br from-gray-800 to-gray-700 border border-gray-600 rounded-2xl px-4 py-3">
                <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-6 border-t border-gray-700">
          <div className="flex gap-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Message ${agent.name}...`}
              className="flex-1 bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
              rows={2}
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-500 hover:to-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Error banner component
function ErrorBanner({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  return (
    <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3">
      <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
      <p className="text-red-200 text-sm flex-1">{message}</p>
      <button
        onClick={onDismiss}
        className="text-red-400 hover:text-red-300 transition-colors"
      >
        ✕
      </button>
    </div>
  );
}

// DEPRECATED: Old simulated responses - now using real Claude API
function getAgentResponse(agentId: string, userInput: string): string {
  const input = userInput.toLowerCase();

  // Product Manager (John)
  if (agentId === 'bmm-pm') {
    if (input.includes('créer') || input.includes('application') || input.includes('app')) {
      return `📋 Excellente idée! Avant de plonger dans la création, j'ai besoin de comprendre le WHY derrière ce projet:

1. **Problème réel:** Quel problème exact résout cette application? Pourquoi les solutions existantes ne suffisent pas?

2. **Utilisateurs cibles:** Qui va utiliser cette app? Quel est leur profil (âge, compétences, contexte)?

3. **Impact business:** Comment mesures-tu le succès? Nombre d'utilisateurs? Revenus? Engagement?

4. **Contraintes:** Budget? Timeline? Équipe disponible?

Réponds à ces questions et je vais créer un PRD solide qui va guider toute l'équipe vers le succès! 🎯`;
    }

    if (input.includes('feature') || input.includes('fonctionnalité')) {
      return `💡 Priorisation de feature! Utilisons la méthode RICE:

**R**each - Combien d'utilisateurs touchés?
**I**mpact - Quel impact sur leur expérience? (LOW/MEDIUM/HIGH/MASSIVE)
**C**onfidence - Quelle confiance dans nos estimations? (%)
**E**ffort - Combien de temps de dev?

Donne-moi ces infos pour chaque feature et je vais calculer le score RICE pour t'aider à prioriser! 📊`;
    }

    return `👋 Je suis John, ton Product Manager. Je peux t'aider avec:

• **Définir les requirements** produit
• **Créer des PRDs** complets
• **Prioriser les features** (méthode RICE)
• **Analyser la valeur business**

Qu'est-ce que tu veux qu'on fasse ensemble?`;
  }

  // Architect (Winston)
  if (agentId === 'bmm-architect') {
    if (input.includes('architecture') || input.includes('design')) {
      return `🏗️ Architecture système! Avant de dessiner, j'ai besoin de comprendre:

**Scale & Performance:**
- Combien d'utilisateurs simultanés attendus? (100, 10K, 100K, 1M+?)
- Quelle latence acceptable? (<100ms, <500ms, <1s?)

**Features Core:**
- Quelles sont les 3 features principales?
- Temps réel nécessaire? (WebSockets, polling?)

**Contraintes:**
- Budget cloud? (AWS/GCP/Azure?)
- Taille de l'équipe? (Affects tech choices)
- Time to market? (MVP rapide ou solution complète?)

Réponds à ces questions et je vais créer une architecture pragmatique qui scale quand nécessaire. Remember: "Boring tech works!" 🚀`;
    }

    if (input.includes('microservices') || input.includes('monolithe')) {
      return `🎯 Monolithe vs Microservices? Voici ma règle pragmatique:

**MONOLITHE (Boring Tech ✅):**
- Team < 10 devs
- < 100K users
- Time to market critique
→ Rails/Django/Laravel + Postgres + Redis

**MICROSERVICES:**
- Team > 20 devs
- > 1M users
- Scaling indépendant critique
→ Event-driven + Kubernetes

**Pour la plupart des projets:** MONOLITHE avec architecture modulaire. Tu peux migrer vers microservices plus tard si vraiment nécessaire.

"Let's design simple solutions that scale when needed!" 💪`;
    }

    return `👋 Je suis Winston, ton Architecte Système. Je peux t'aider avec:

• **Architecture système** scale-adaptive
• **Décisions techniques** pragmatiques
• **Sélection de technologies** ("boring tech wins")
• **Patterns de scalabilité**

Dis-moi ce que tu construis et on va créer une architecture solide!`;
  }

  // Developer
  if (agentId === 'bmm-coder' || agentId === 'bmm-developer') {
    if (input.includes('code') || input.includes('implément')) {
      return `💻 Implémentation! Voici mon approche:

1. **Clarifier requirements** - Qu'est-ce qui doit être fait exactement?
2. **TDD** - Écrire les tests d'abord
3. **Code propre** - Lisible, maintainable, DRY
4. **Review** - Vérifier qualité avant commit

Donne-moi plus de détails sur ce que tu veux implémenter et je vais te montrer avec du code! 🚀

"Let me show you with code, not words!" 💪`;
    }

    if (input.includes('review') || input.includes('refactor')) {
      return `🔍 Code review! Partage-moi le code et je vais analyser:

**Checklist:**
✅ Security (SQL injection, XSS, auth)
✅ Performance (N+1 queries, caching)
✅ Maintainability (complexité, naming, DRY)
✅ Tests (coverage, edge cases)

Je vais identifier les problèmes et proposer du code refactoré avec les best practices! 🎯`;
    }

    return `👋 Je suis le Developer de l'équipe. Je peux t'aider avec:

• **Implémentation** de features
• **Code reviews** détaillés
• **Refactoring** pour améliorer qualité
• **Debugging** et résolution de bugs

Montre-moi du code ou dis-moi ce que tu veux implémenter!`;
  }

  // Tester
  if (agentId === 'bmm-tester') {
    return `🧪 Testing & QA! Je peux t'aider avec:

• **Stratégie de tests** complète
• **Génération de tests** (unitaires, intégration, E2E)
• **Coverage analysis** (>80% target)
• **Test automation** et CI/CD

Pour quel module veux-tu des tests?`;
  }

  // Debugger
  if (agentId === 'bmm-debugger') {
    return `🐛 Debug & Fix! Décris-moi le bug:

1. **Symptôme:** Qu'est-ce qui ne marche pas?
2. **Steps to reproduce:** Comment reproduire?
3. **Expected vs Actual:** Comportement attendu vs réel?
4. **Logs/Errors:** Messages d'erreur?

Je vais t'aider à identifier la root cause et proposer un fix avec tests de régression! 🔧`;
  }

  // Default response
  return `Je suis ${agentId.replace('bmm-', '').replace('bmb-', '').replace('cis-', '')}. Comment puis-je t'aider aujourd'hui?`;
}
