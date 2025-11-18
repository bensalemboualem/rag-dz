import { FileText, Upload, Search, Download, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function DocumentsPage() {
  const navigate = useNavigate();
  const [documents] = useState([
    { id: 1, name: 'Architecture.pdf', size: '2.3 MB', date: '2025-01-15', type: 'pdf' },
    { id: 2, name: 'Requirements.docx', size: '1.1 MB', date: '2025-01-14', type: 'docx' },
    { id: 3, name: 'API_Docs.txt', size: '450 KB', date: '2025-01-13', type: 'txt' },
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="w-10 h-10 text-orange-400" />
            <div>
              <h1 className="text-4xl font-bold text-white">Documents</h1>
              <p className="text-gray-400">Manage your uploaded files</p>
            </div>
          </div>
          <button className="px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl hover:from-orange-500 hover:to-red-500 transition-all font-bold shadow-lg flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload Document
          </button>
        </div>

        {/* Search */}
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex gap-3">
            <Search className="w-5 h-5 text-gray-400 mt-3" />
            <input
              type="text"
              placeholder="Search documents..."
              className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none text-lg"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => navigate('/bmad')}
            className="p-6 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl hover:scale-105 transition-all text-white text-left shadow-xl"
          >
            <h3 className="font-bold text-lg mb-1">Ask BMAD Agent</h3>
            <p className="text-sm text-blue-100">Chat about your documents</p>
          </button>

          <button
            onClick={() => navigate('/knowledge')}
            className="p-6 bg-gradient-to-br from-purple-600 to-purple-500 rounded-xl hover:scale-105 transition-all text-white text-left shadow-xl"
          >
            <h3 className="font-bold text-lg mb-1">Search Knowledge</h3>
            <p className="text-sm text-purple-100">RAG-powered search</p>
          </button>

          <button
            onClick={() => navigate('/chat')}
            className="p-6 bg-gradient-to-br from-green-600 to-green-500 rounded-xl hover:scale-105 transition-all text-white text-left shadow-xl"
          >
            <h3 className="font-bold text-lg mb-1">AI Chat</h3>
            <p className="text-sm text-green-100">Combined RAG + Agents</p>
          </button>
        </div>

        {/* Documents List */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <div className="p-4 border-b border-gray-700 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Your Documents</h2>
            <span className="text-gray-400">{documents.length} files</span>
          </div>

          <div className="divide-y divide-gray-700">
            {documents.map((doc) => (
              <div key={doc.id} className="p-4 hover:bg-gray-700/50 transition-colors flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-600/20 rounded-lg">
                    <FileText className="w-6 h-6 text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{doc.name}</h3>
                    <p className="text-sm text-gray-400">{doc.size} • {doc.date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-600 rounded-lg transition-colors text-gray-400 hover:text-blue-400">
                    <Download className="w-5 h-5" />
                  </button>
                  <button className="p-2 hover:bg-gray-600 rounded-lg transition-colors text-gray-400 hover:text-red-400">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 bg-gray-800 rounded-xl border border-gray-700">
            <div className="text-3xl font-bold text-orange-400 mb-2">{documents.length}</div>
            <div className="text-gray-400">Total Documents</div>
          </div>
          <div className="p-6 bg-gray-800 rounded-xl border border-gray-700">
            <div className="text-3xl font-bold text-blue-400 mb-2">3.8 MB</div>
            <div className="text-gray-400">Total Size</div>
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
