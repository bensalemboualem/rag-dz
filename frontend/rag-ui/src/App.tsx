import { useState } from 'react';
import './App.css';
import './styles/ithy-presentation.css';
import { IthyStyleRenderer } from './components/presentation';
import { transformToIthyFormat } from './lib/rag/responseTransformer';
import type { IthyResponseProps } from './components/presentation';

const API_URL = import.meta.env.VITE_API_URL || (window.location.origin.includes('localhost') ? 'http://localhost:8180' : '');
const API_KEY = import.meta.env.VITE_API_KEY || (window.location.origin.includes('localhost') ? 'ragdz_dev_demo_key_12345678901234567890' : '9b793e7f8dc29d64c7b655217a196ddc5831e0df5584c8f1ada3d43de44a5f46');

type SourceType = 'file' | 'url';

interface Message {
  role: string;
  content: string;
  rawData?: any; // Pour stocker la réponse RAG complète
  ithyData?: IthyResponseProps; // Pour stocker la version transformée
}

export default function App() {
  const [sourceType, setSourceType] = useState<SourceType>('file');
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState('');
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Array<Message>>([]);
  const [loading, setLoading] = useState(false);
  const [ithyMode, setIthyMode] = useState(true); // Toggle pour mode ithy

  // Upload document depuis fichier
  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        headers: {
          'X-API-Key': API_KEY
        },
        body: formData
      });
      const data = await res.json();
      setMessages(prev => [...prev, {
        role: 'system',
        content: `✅ Document uploadé: ${data.filename} (${data.chunks_created} chunks)`
      }]);
      setFile(null);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'system',
        content: `❌ Erreur: ${error}`
      }]);
    } finally {
      setLoading(false);
    }
  };

  // Upload document depuis URL (YouTube, site web, etc.)
  const handleUploadFromURL = async () => {
    if (!url.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/upload-url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': API_KEY
        },
        body: JSON.stringify({ url: url.trim() })
      });
      const data = await res.json();

      if (data.error) {
        setMessages(prev => [...prev, {
          role: 'system',
          content: `❌ Erreur: ${data.error}`
        }]);
      } else {
        setMessages(prev => [...prev, {
          role: 'system',
          content: `✅ Contenu extrait de l'URL: ${data.source_type} (${data.chunks_created} chunks)`
        }]);
        setUrl('');
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'system',
        content: `❌ Erreur: ${error}`
      }]);
    } finally {
      setLoading(false);
    }
  };

  // Query RAG
  const handleQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMessage = query;
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setQuery('');
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': API_KEY
        },
        body: JSON.stringify({
          query: userMessage,
          max_results: 5,
          use_llm: true
        })
      });
      const data = await res.json();

      // Transformer la réponse en format ithy si activé
      let ithyData: IthyResponseProps | undefined;
      if (ithyMode && data.answer) {
        try {
          ithyData = transformToIthyFormat({
            query: userMessage,
            answer: data.answer,
            sources: data.sources || [],
            chunks: data.results || [],
            confidence: data.confidence || 0.75
          });
        } catch (err) {
          console.error('Erreur transformation ithy:', err);
        }
      }

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.answer || data.results?.map((r: any) => r.text).join('\n\n') || 'Aucun résultat',
        rawData: data,
        ithyData
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'system',
        content: `❌ Erreur: ${error}`
      }]);
    } finally {
      setLoading(false);
    }
  };

  // Send to BMAD Orchestrator
  const handleSendToBMAD = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/orchestrator/workflow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'ragdz_dev_demo_key_12345678901234567890'
        },
        body: JSON.stringify({
          task: 'create_project',
          description: messages.filter(m => m.role === 'user').map(m => m.content).join('\n'),
          target: 'bolt'
        })
      });
      const data = await res.json();
      setMessages(prev => [...prev, {
        role: 'system',
        content: `🤖 BMAD Workflow lancé: ${data.workflow_id}`
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'system',
        content: `❌ Erreur BMAD: ${error}`
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="header site-header">
        <h1>🇩🇿 RAG.dz - Upload & Chat</h1>
        <div className="links">
          <a href="http://localhost:3737" target="_blank">Archon</a>
          <a href="http://localhost:5174" target="_blank">Bolt.DIY</a>
          <a href={`${API_URL}/docs`} target="_blank">API Docs</a>
        </div>
      </header>

      <div className="container">
        {/* Upload Zone */}
        <div className="upload-section">
          <h2>📤 Ajouter une Source</h2>

          {/* Toggle Source Type */}
          <div className="source-toggle">
            <button
              className={sourceType === 'file' ? 'active' : ''}
              onClick={() => setSourceType('file')}
              disabled={loading}
            >
              📁 Fichier
            </button>
            <button
              className={sourceType === 'url' ? 'active' : ''}
              onClick={() => setSourceType('url')}
              disabled={loading}
            >
              🔗 URL
            </button>
          </div>

          {/* File Upload */}
          {sourceType === 'file' && (
            <div className="file-upload">
              <input
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                accept=".txt,.pdf,.docx,.md,.csv,.xlsx,.xls"
                disabled={loading}
              />
              <p className="supported-formats">
                Formats supportés: TXT, PDF, DOCX, Markdown, CSV, Excel
              </p>
              {file && (
                <div className="file-info">
                  <span>📄 {file.name}</span>
                  <button onClick={handleUpload} disabled={loading}>
                    Uploader
                  </button>
                </div>
              )}
            </div>
          )}

          {/* URL Upload */}
          {sourceType === 'url' && (
            <div className="url-upload">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                disabled={loading}
              />
              <p className="supported-formats">
                Supporté: YouTube, sites web, articles, docs en ligne
              </p>
              {url.trim() && (
                <button onClick={handleUploadFromURL} disabled={loading}>
                  Extraire le contenu
                </button>
              )}
            </div>
          )}
        </div>

        {/* Chat Zone */}
        <div className="chat-section">
          <div className="chat-header">
            <h2>💬 RAG Chatbot</h2>
            <div className="ithy-toggle">
              <label>
                <input
                  type="checkbox"
                  checked={ithyMode}
                  onChange={(e) => setIthyMode(e.target.checked)}
                />
                <span>🎨 Mode Présentation Ithy</span>
              </label>
            </div>
          </div>

          <div className="messages">
            {messages.length === 0 && (
              <div className="placeholder">
                Posez une question sur vos documents...
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`message ${msg.role}`}>
                {msg.role === 'assistant' && msg.ithyData && ithyMode ? (
                  // Rendu ithy-style enrichi
                  <IthyStyleRenderer {...msg.ithyData} />
                ) : (
                  // Rendu simple classique
                  <>
                    <strong>{msg.role === 'user' ? '👤' : msg.role === 'assistant' ? '🤖' : 'ℹ️'}</strong>
                    <p style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</p>
                  </>
                )}
              </div>
            ))}
            {loading && (
              <div className="message system">
                <strong>⏳</strong>
                <p>Traitement en cours...</p>
              </div>
            )}
          </div>

          <form onSubmit={handleQuery} className="query-form">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Posez votre question..."
              disabled={loading}
            />
            <button type="submit" disabled={loading || !query.trim()}>
              Envoyer
            </button>
          </form>

          {messages.length > 0 && (
            <button onClick={handleSendToBMAD} className="bmad-button" disabled={loading}>
              🚀 Envoyer à BMAD Orchestrator
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
