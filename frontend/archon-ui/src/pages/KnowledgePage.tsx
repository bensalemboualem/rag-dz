import { Database, Search, Upload, FileText, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface SearchResult {
  id: string;
  title: string;
  content: string;
  score: number;
  source: string;
}

export function KnowledgePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      // TODO: Call real RAG search API
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock results for now
      setResults([
        {
          id: '1',
          title: 'Architecture Documentation',
          content: 'System architecture overview with microservices design patterns...',
          score: 0.95,
          source: 'Architecture.pdf',
        },
        {
          id: '2',
          title: 'API Requirements',
          content: 'RESTful API specifications and authentication requirements...',
          score: 0.87,
          source: 'Requirements.docx',
        },
      ]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Database className="w-10 h-10 text-purple-400" />
            <div>
              <h1 className="text-4xl font-bold text-white">Knowledge Base</h1>
              <p className="text-gray-400">RAG-powered semantic search</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/documents')}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all font-bold shadow-lg flex items-center gap-2"
          >
            <Upload className="w-5 h-5" />
            Upload Documents
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-xl">
          <div className="flex gap-4">
            <div className="flex-1 flex items-center gap-3 bg-gray-900 rounded-lg px-4 py-3 border border-gray-700">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Ask a question about your documents..."
                className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none text-lg"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={isSearching || !searchQuery.trim()}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-500 hover:to-pink-500 transition-all font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSearching ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Search
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => navigate('/bmad')}
            className="p-6 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl hover:scale-105 transition-all text-white text-left shadow-xl"
          >
            <h3 className="font-bold text-lg mb-1">Ask BMAD Agent</h3>
            <p className="text-sm text-blue-100">Chat with AI experts</p>
          </button>

          <button
            onClick={() => navigate('/chat')}
            className="p-6 bg-gradient-to-br from-green-600 to-green-500 rounded-xl hover:scale-105 transition-all text-white text-left shadow-xl"
          >
            <h3 className="font-bold text-lg mb-1">AI Chat</h3>
            <p className="text-sm text-green-100">Combined RAG + Agents</p>
          </button>

          <button
            onClick={() => navigate('/documents')}
            className="p-6 bg-gradient-to-br from-orange-600 to-orange-500 rounded-xl hover:scale-105 transition-all text-white text-left shadow-xl"
          >
            <h3 className="font-bold text-lg mb-1">Documents</h3>
            <p className="text-sm text-orange-100">Manage your files</p>
          </button>
        </div>

        {/* Search Results */}
        {results.length > 0 && (
          <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-700 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Search Results</h2>
              <span className="text-gray-400">{results.length} results found</span>
            </div>

            <div className="divide-y divide-gray-700">
              {results.map((result) => (
                <div key={result.id} className="p-6 hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-purple-600/20 rounded-lg">
                      <FileText className="w-6 h-6 text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-white">{result.title}</h3>
                        <span className="text-xs px-2 py-1 bg-purple-600/30 rounded-full text-purple-300">
                          {Math.round(result.score * 100)}% match
                        </span>
                      </div>
                      <p className="text-gray-400 mb-2">{result.content}</p>
                      <div className="text-sm text-gray-500">
                        Source: <span className="text-purple-400">{result.source}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {results.length === 0 && !isSearching && (
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-12 text-center">
            <Database className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-400 mb-2">No search results yet</h3>
            <p className="text-gray-500">Enter a question above to search your knowledge base</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 bg-gray-800 rounded-xl border border-gray-700">
            <div className="text-3xl font-bold text-purple-400 mb-2">3</div>
            <div className="text-gray-400">Documents Indexed</div>
          </div>
          <div className="p-6 bg-gray-800 rounded-xl border border-gray-700">
            <div className="text-3xl font-bold text-blue-400 mb-2">1,247</div>
            <div className="text-gray-400">Knowledge Chunks</div>
          </div>
          <div className="p-6 bg-gray-800 rounded-xl border border-gray-700">
            <div className="text-3xl font-bold text-green-400 mb-2">19</div>
            <div className="text-gray-400">AI Agents Available</div>
          </div>
        </div>
      </div>
    </div>
  );
}
