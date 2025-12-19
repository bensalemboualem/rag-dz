'use client'

import { useState, useRef, useEffect } from 'react'

type ChatMode = 'chat' | 'rag' | 'support'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export function HelpChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [mode, setMode] = useState<ChatMode>('chat')
  const [ragSelection, setRagSelection] = useState('DZ')
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '👋 Bonjour ! Je suis <strong>Dzir IA</strong>, votre assistant IAFactory Algeria. Comment puis-je vous aider ?'
    }
  ])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const toggleHelpWindow = () => {
    setIsOpen(!isOpen)
  }

  const setHelpMode = (newMode: ChatMode) => {
    setMode(newMode)
  }

  const sendMessage = async () => {
    if (!message.trim() || isLoading) return

    const userMessage = message
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setMessage('')
    setIsLoading(true)

    try {
      // Afficher le message de chargement
      setMessages(prev => [...prev, { role: 'assistant', content: '⏳ Réflexion en cours...' }])

      // Appel au backend sécurisé
      const response = await fetch('/api/help-chat/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: userMessage,
          mode: mode,
          rag_context: mode === 'rag' ? ragSelection : null
        })
      })

      // Supprimer le message de chargement
      setMessages(prev => prev.slice(0, -1))

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || 'Erreur de communication avec le serveur')
      }

      const data = await response.json()
      const botResponse = data.response || 'Désolé, je n\'ai pas pu répondre.'
      setMessages(prev => [...prev, { role: 'assistant', content: botResponse }])

    } catch (error) {
      // Supprimer le message de chargement en cas d'erreur
      setMessages(prev => prev.filter(m => m.content !== '⏳ Réflexion en cours...'))

      let errorMsg = '⚠️ Désolé, une erreur s\'est produite. Veuillez réessayer.'
      if (error instanceof Error && error.message && error.message !== 'Failed to fetch') {
        errorMsg = `⚠️ ${error.message}`
      }
      setMessages(prev => [...prev, { role: 'assistant', content: errorMsg }])
      console.error('Help chat error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') sendMessage()
  }

  return (
    <div className="help-bubble" id="helpBubble">
      <span className="help-label">Dzir IA - Aide</span>
      <button className="help-btn" onClick={toggleHelpWindow}>
        <img
          src="/assets/images/lala-fatma.png"
          alt="Dzir IA"
          style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; (e.target as HTMLImageElement).parentElement!.innerHTML = '💬'; }}
        />
      </button>

      <div className={`help-window ${isOpen ? 'open' : ''}`} id="helpWindow">
        <div className="help-header">
          <h3>
            <img
              src="/assets/images/lala-fatma.png"
              alt="Dzir IA"
              style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover', verticalAlign: 'middle', marginRight: '8px' }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
            <span>Dzir IA</span>
          </h3>
          <button className="close-help-btn" onClick={toggleHelpWindow}>×</button>
        </div>

        {/* 3 MODES : Chat IA / Recherche RAG / Support */}
        <div className="help-modes">
          <button
            className={`help-mode-btn ${mode === 'chat' ? 'active' : ''}`}
            id="chatModeBtn"
            onClick={() => setHelpMode('chat')}
          >
            💬 <span>Chat IA</span>
          </button>
          <button
            className={`help-mode-btn ${mode === 'rag' ? 'active' : ''}`}
            id="ragModeBtn"
            onClick={() => setHelpMode('rag')}
          >
            🔍 <span>Recherche RAG</span>
          </button>
          <button
            className={`help-mode-btn ${mode === 'support' ? 'active' : ''}`}
            id="supportModeBtn"
            onClick={() => setHelpMode('support')}
          >
            📞 <span>Support</span>
          </button>
        </div>

        {/* SÉLECTEUR RAG (affiché en mode Recherche) */}
        {mode === 'rag' && (
          <div className="help-rag-selector" id="helpRagSelector">
            <select
              id="helpRagSelect"
              value={ragSelection}
              onChange={(e) => setRagSelection(e.target.value)}
            >
              <option value="DZ">🇩🇿 Business DZ (Algérie)</option>
              <option value="CH">🎓 École (Suisse)</option>
              <option value="GLOBAL">🕌 Islam (Global)</option>
              <option value="ALL">🌍 Tous les RAG</option>
            </select>
          </div>
        )}

        {/* BANNER SUPPORT (affiché en mode Support) */}
        {mode === 'support' && (
          <div className="help-support-banner" id="helpSupportBanner">
            ⚠️ <span>Mode support humain activé</span>
            <br />
            <button className="back-to-ai-btn" onClick={() => setHelpMode('chat')}>
              <img
                src="/assets/images/lala-fatma.png"
                alt="Dzir IA"
                style={{ width: '18px', height: '18px', borderRadius: '50%', objectFit: 'cover', verticalAlign: 'middle', marginRight: '4px' }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
              <span>Revenir au mode IA</span>
            </button>
          </div>
        )}

        {/* MESSAGES */}
        <div className="help-messages" id="helpMessages">
          {messages.map((msg, i) => (
            <div key={i} className={`help-message ${msg.role === 'assistant' ? 'help-bot' : 'help-user'}`}>
              {msg.role === 'assistant' && (
                <div className="help-avatar">
                  <img
                    src="/assets/images/lala-fatma.png"
                    alt="Dzir IA"
                    style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', boxShadow: '0 2px 8px rgba(0,132,61,0.3)' }}
                    onError={(e) => { (e.target as HTMLImageElement).outerHTML = '🤖'; }}
                  />
                </div>
              )}
              <div className="help-bubble-msg" dangerouslySetInnerHTML={{ __html: msg.content }} />
            </div>
          ))}
          {isLoading && (
            <div className="help-message help-bot">
              <div className="help-avatar">
                <img
                  src="/assets/images/lala-fatma.png"
                  alt="Dzir IA"
                  style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                  onError={(e) => { (e.target as HTMLImageElement).outerHTML = '🤖'; }}
                />
              </div>
              <div className="help-bubble-msg">...</div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* INPUT */}
        <div className="help-input">
          <input
            type="text"
            id="helpInput"
            placeholder="Tapez votre message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button className="help-send-btn" onClick={sendMessage} id="helpSendBtn">➤</button>
        </div>
      </div>
    </div>
  )
}
