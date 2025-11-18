import { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axios from 'axios';

// Configuration API RAG.dz depuis variables d'environnement
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8180';
const API_KEY = import.meta.env.VITE_API_KEY || '';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'X-API-Key': API_KEY,
    'Content-Type': 'application/json'
  }
});

// Intercepteur pour ajouter la clé API dynamiquement
api.interceptors.request.use((config) => {
  const apiKey = import.meta.env.VITE_API_KEY || sessionStorage.getItem('apiKey');
  if (apiKey) {
    config.headers['X-API-Key'] = apiKey;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Create QueryClient optimized for RAG.dz
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2000,
      gcTime: 5 * 60 * 1000,
      retry: 3,
      refetchOnWindowFocus: true,
      refetchOnReconnect: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Types
interface SearchResult {
  title: string;
  text: string;
  language: string;
  score: number;
  created_at?: number;
}

interface QueryResponse {
  answer: string;
  results: SearchResult[];
  query: string;
  search_time_ms: number;
  total_results: number;
}

interface EmbedTestResult {
  tenant: string;
  queries: string[];
  embeddings_count: number;
  vector_size: number;
  collection_created: string;
  error?: string;
}

// Health monitoring service adapté pour RAG.dz
class HealthService {
  private interval: NodeJS.Timeout | null = null;
  private callbacks: {
    onDisconnected?: () => void;
    onReconnected?: () => void;
  } = {};

  startMonitoring(callbacks: { onDisconnected?: () => void; onReconnected?: () => void }) {
    this.callbacks = callbacks;
    this.stopMonitoring();
    
    this.interval = setInterval(async () => {
      try {
        await api.get('/health');
      } catch (error) {
        this.callbacks.onDisconnected?.();
      }
    }, 5000);
  }

  stopMonitoring() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }
}

const healthService = new HealthService();

// Layout Components
const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <nav style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e7eb',
        padding: '1rem 2rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ margin: 0, color: '#2563eb', fontSize: '1.5rem', fontWeight: 'bold' }}>
            RAG.dz
          </h1>
          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
            <span>🟢 API Connectée</span>
            <span>📍 Algérie</span>
          </div>
        </div>
      </nav>
      <main style={{ padding: '2rem' }}>
        {children}
      </main>
    </div>
  );
};

// Disconnect Screen Component
const DisconnectScreenOverlay = ({ 
  isActive, 
  onDismiss 
}: { 
  isActive: boolean; 
  onDismiss: () => void; 
}) => {
  if (!isActive) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        textAlign: 'center',
        maxWidth: '400px'
      }}>
        <h2 style={{ color: '#dc2626', marginBottom: '1rem' }}>Connexion perdue</h2>
        <p style={{ marginBottom: '1.5rem', color: '#6b7280' }}>
          La connexion avec l'API RAG.dz a été interrompue. Vérifiez que le serveur est démarré.
        </p>
        <button
          onClick={onDismiss}
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Continuer hors ligne
        </button>
      </div>
    </div>
  );
};

// Main Knowledge Base Page Component
const KnowledgeBasePage = () => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<QueryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [embedTest, setEmbedTest] = useState<EmbedTestResult | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const testEmbeddings = async () => {
    setLoading(true);
    try {
      const response = await api.post('/api/test/embed');
      setEmbedTest(response.data);
    } catch (error) {
      setEmbedTest({ 
        error: 'Erreur de connexion à l\'API',
        tenant: '',
        queries: [],
        embeddings_count: 0,
        vector_size: 0,
        collection_created: ''
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const response = await api.post('/api/query', {
        query: query,
        max_results: 5
      });
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching:', error);
      setSearchResults({
        answer: 'Erreur lors de la recherche. Vérifiez que des documents ont été ajoutés.',
        results: [],
        query: query,
        search_time_ms: 0,
        total_results: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (file: File) => {
    setLoading(true);
    setUploadStatus('Upload en cours...');
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-API-Key': API_KEY
        }
      });
      
      setUploadStatus(
        `✅ ${file.name} traité avec succès!\n` +
        `📄 ${response.data.chunks_created} segments créés\n` +
        `🗃️ Collection: ${response.data.collection}`
      );
    } catch (error: any) {
      setUploadStatus(`❌ Erreur upload: ${error.response?.data?.detail || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      uploadFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      uploadFile(files[0]);
    }
  };

  const formatLanguage = (lang: string) => {
    const languages: Record<string, string> = {
      'fr': '🇫🇷 Français',
      'en': '🇬🇧 English', 
      'ar': '🇩🇿 العربية'
    };
    return languages[lang] || lang;
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1e40af', marginBottom: '1rem' }}>
          Intelligence Artificielle Trilingue
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#64748b', marginBottom: '0.5rem' }}>
          Recherche et analyse de documents en Français • English • العربية
        </p>
        <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
          Plateforme RAG adaptée au marché algérien
        </p>
      </div>

      {/* Test du système */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '2rem',
        marginBottom: '2rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          🔧 Vérification Système
        </h2>
        <button 
          onClick={testEmbeddings}
          disabled={loading}
          style={{
            backgroundColor: loading ? '#9ca3af' : '#3b82f6',
            color: 'white',
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '1rem',
            fontWeight: '500',
            marginBottom: '1rem'
          }}
        >
          {loading ? 'Test en cours...' : 'Tester Capacités Multilingues'}
        </button>
        
        {embedTest && (
          <div style={{
            marginTop: '1rem',
            padding: '1rem',
            backgroundColor: '#f8fafc',
            borderRadius: '6px',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Résultats du test :</h3>
            {embedTest.error ? (
              <p style={{ color: '#dc2626' }}>{embedTest.error}</p>
            ) : (
              <div>
                <p><strong>Tenant :</strong> {embedTest.tenant}</p>
                <p><strong>Phrases analysées :</strong></p>
                <ul style={{ marginLeft: '1.5rem', marginBottom: '1rem' }}>
                  {embedTest.queries?.map((q: string, i: number) => (
                    <li key={i} style={{ marginBottom: '0.25rem' }}>{q}</li>
                  ))}
                </ul>
                <p><strong>Vecteurs générés :</strong> {embedTest.embeddings_count} × {embedTest.vector_size} dimensions</p>
                <p style={{ color: '#16a34a', fontWeight: '600' }}>✅ Système opérationnel et prêt</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Upload de documents */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '2rem',
        marginBottom: '2rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          📄 Gestion Documents
        </h2>
        
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onDragEnter={() => setDragActive(true)}
          onDragLeave={() => setDragActive(false)}
          style={{
            border: `2px dashed ${dragActive ? '#3b82f6' : '#d1d5db'}`,
            borderRadius: '8px',
            padding: '3rem 2rem',
            textAlign: 'center',
            backgroundColor: dragActive ? '#eff6ff' : '#fafbfc',
            cursor: 'pointer',
            transition: 'all 0.2s',
            marginBottom: '1rem'
          }}
          onClick={() => fileInputRef.current?.click()}
        >
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📁</div>
          <h3 style={{ marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
            Ajoutez vos documents
          </h3>
          <p style={{ marginBottom: '1rem', color: '#6b7280' }}>
            Glissez-déposez vos fichiers ici ou utilisez le bouton ci-dessous
          </p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '500',
              marginBottom: '1rem'
            }}
          >
            Choisir un fichier
          </button>
          <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
            Formats supportés : TXT, PDF, DOCX • Toutes langues acceptées
          </p>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            accept=".txt,.pdf,.docx,.doc"
            style={{ display: 'none' }}
          />
        </div>
        
        {uploadStatus && (
          <div style={{
            padding: '1rem',
            backgroundColor: uploadStatus.includes('✅') ? '#f0fdf4' : '#fef2f2',
            border: `1px solid ${uploadStatus.includes('✅') ? '#bbf7d0' : '#fecaca'}`,
            borderRadius: '6px',
            whiteSpace: 'pre-line'
          }}>
            <p style={{ 
              color: uploadStatus.includes('✅') ? '#166534' : '#dc2626',
              margin: 0,
              fontFamily: 'monospace'
            }}>
              {uploadStatus}
            </p>
          </div>
        )}
      </div>

      {/* Interface de recherche */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '2rem',
        marginBottom: '2rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          🔍 Assistant Intelligent
        </h2>
        
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Posez votre question en français, anglais ou arabe..."
            style={{
              flex: 1,
              padding: '1rem',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '1rem',
              outline: 'none',
              transition: 'border-color 0.2s'
            }}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            dir="auto"
          />
          <button
            onClick={handleSearch}
            disabled={loading || !query.trim()}
            style={{
              backgroundColor: (loading || !query.trim()) ? '#9ca3af' : '#10b981',
              color: 'white',
              padding: '1rem 2rem',
              border: 'none',
              borderRadius: '8px',
              cursor: (loading || !query.trim()) ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              minWidth: '140px'
            }}
          >
            {loading ? 'Recherche...' : 'Rechercher'}
          </button>
        </div>
        
        {searchResults && (
          <div style={{ marginTop: '2rem' }}>
            <div style={{
              padding: '1.5rem',
              backgroundColor: '#f0f9ff',
              border: '2px solid #0ea5e9',
              borderRadius: '8px',
              marginBottom: '1.5rem'
            }}>
              <h3 style={{ fontWeight: '600', marginBottom: '1rem', color: '#0369a1', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                🤖 Réponse de l'IA
              </h3>
              <p style={{ marginBottom: '1rem', lineHeight: '1.6', fontSize: '1.05rem' }}>
                {searchResults.answer}
              </p>
              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: '#64748b' }}>
                <span>⚡ {searchResults.search_time_ms}ms</span>
                <span>📊 {searchResults.total_results} source(s) trouvée(s)</span>
                <span>🔍 Requête : "{searchResults.query}"</span>
              </div>
            </div>
            
            {searchResults.results.length > 0 && (
              <div>
                <h4 style={{ fontWeight: '600', marginBottom: '1rem', fontSize: '1.2rem' }}>
                  📚 Sources documentaires :
                </h4>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {searchResults.results.map((result, i) => (
                    <div key={i} style={{
                      padding: '1.5rem',
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      borderLeft: '4px solid #10b981',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'flex-start', 
                        marginBottom: '0.75rem',
                        flexWrap: 'wrap',
                        gap: '0.5rem'
                      }}>
                        <h5 style={{ fontWeight: '600', margin: 0, fontSize: '1.1rem', flex: 1 }}>
                          {result.title}
                        </h5>
                        <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.75rem' }}>
                          <span style={{ 
                            padding: '0.25rem 0.5rem', 
                            backgroundColor: '#f3f4f6', 
                            borderRadius: '4px',
                            fontWeight: '500'
                          }}>
                            {formatLanguage(result.language)}
                          </span>
                          <span style={{ 
                            padding: '0.25rem 0.5rem', 
                            backgroundColor: '#fef3c7', 
                            borderRadius: '4px',
                            fontWeight: '600',
                            color: '#92400e'
                          }}>
                            {(result.score * 100).toFixed(0)}% pertinent
                          </span>
                        </div>
                      </div>
                      <p style={{ 
                        fontSize: '0.95rem', 
                        color: '#4b5563', 
                        lineHeight: '1.6',
                        margin: 0
                      }}>
                        {result.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Settings Page placeholder
const SettingsPage = () => (
  <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
    <h1>Paramètres RAG.dz</h1>
    <p>Configuration des quotas, langues et modèles (prochainement)</p>
  </div>
);

// App Routes
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<KnowledgeBasePage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

// Main App Content
const AppContent = () => {
  const [disconnectScreenActive, setDisconnectScreenActive] = useState(false);
  const [disconnectScreenDismissed, setDisconnectScreenDismissed] = useState(false);

  useEffect(() => {
    healthService.stopMonitoring();

    healthService.startMonitoring({
      onDisconnected: () => {
        if (!disconnectScreenDismissed) {
          setDisconnectScreenActive(true);
        }
      },
      onReconnected: () => {
        setDisconnectScreenActive(false);
        setDisconnectScreenDismissed(false);
        window.location.reload();
      }
    });

    return () => {
      healthService.stopMonitoring();
    };
  }, [disconnectScreenDismissed]);

  const handleDismissDisconnectScreen = () => {
    setDisconnectScreenActive(false);
    setDisconnectScreenDismissed(true);
  };

  return (
    <>
      <Router>
        <MainLayout>
          <AppRoutes />
        </MainLayout>
      </Router>
      <DisconnectScreenOverlay
        isActive={disconnectScreenActive}
        onDismiss={handleDismissDisconnectScreen}
      />
    </>
  );
};

// Main App Component
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}