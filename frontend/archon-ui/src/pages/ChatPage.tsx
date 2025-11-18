import { MessageSquare, Send, Sparkles, Bot, Database, FileText } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: string[];
}

export function ChatPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI assistant with access to your knowledge base and 19 expert BMAD agents. How can I help you today?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isSending) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsSending(true);

    try {
      // TODO: Call real RAG + BMAD chat API
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'This is a combined RAG + Agent response. In production, this will search your knowledge base and consult with relevant BMAD agents to provide comprehensive answers.',
        timestamp: new Date(),
        sources: ['Architecture.pdf', 'Requirements.docx'],
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-10 h-10 text-green-400" />
            <div>
              <h1 className="text-4xl font-bold text-white">AI Chat</h1>
              <p className="text-gray-400">RAG + Agents combined intelligence</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 bg-green-600/20 rounded-lg border border-green-600/30 text-green-400 text-sm font-medium">
              <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
              Online
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => navigate('/bmad')}
            className="p-6 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl hover:scale-105 transition-all text-white text-left shadow-xl"
          >
            <h3 className="font-bold text-lg mb-1">BMAD Agents</h3>
            <p className="text-sm text-blue-100">19 AI experts</p>
          </button>

          <button
            onClick={() => navigate('/knowledge')}
            className="p-6 bg-gradient-to-br from-purple-600 to-purple-500 rounded-xl hover:scale-105 transition-all text-white text-left shadow-xl"
          >
            <h3 className="font-bold text-lg mb-1">Knowledge Base</h3>
            <p className="text-sm text-purple-100">RAG search</p>
          </button>

          <button
            onClick={() => navigate('/documents')}
            className="p-6 bg-gradient-to-br from-orange-600 to-orange-500 rounded-xl hover:scale-105 transition-all text-white text-left shadow-xl"
          >
            <h3 className="font-bold text-lg mb-1">Documents</h3>
            <p className="text-sm text-orange-100">Manage files</p>
          </button>
        </div>

        {/* Chat Container */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-xl flex flex-col h-[600px]">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    message.role === 'user'
                      ? 'bg-blue-600'
                      : 'bg-gradient-to-br from-green-600 to-teal-600'
                  }`}
                >
                  {message.role === 'user' ? (
                    <span className="text-white text-sm font-bold">U</span>
                  ) : (
                    <Bot className="w-5 h-5 text-white" />
                  )}
                </div>

                {/* Message Content */}
                <div className={`flex-1 max-w-[80%] ${message.role === 'user' ? 'items-end' : ''}`}>
                  <div
                    className={`rounded-xl p-4 ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-100'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>

                    {/* Sources */}
                    {message.sources && message.sources.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-600 space-y-1">
                        <div className="text-xs text-gray-400 font-medium">Sources:</div>
                        {message.sources.map((source, idx) => (
                          <div
                            key={idx}
                            className="text-xs text-green-400 flex items-center gap-1"
                          >
                            <FileText className="w-3 h-3" />
                            {source}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 mt-1 px-1">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isSending && (
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-600 to-teal-600 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-gray-700 rounded-xl p-4">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-700 p-4">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder="Ask anything... I have access to your documents and AI agents"
                className="flex-1 bg-gray-900 text-white placeholder-gray-500 rounded-lg px-4 py-3 outline-none border border-gray-700 focus:border-green-600 transition-colors"
                disabled={isSending}
              />
              <button
                onClick={handleSend}
                disabled={isSending || !input.trim()}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:from-green-500 hover:to-teal-500 transition-all font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSending ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 bg-gray-800 rounded-xl border border-gray-700">
            <div className="text-3xl font-bold text-green-400 mb-2">{messages.length - 1}</div>
            <div className="text-gray-400">Messages Sent</div>
          </div>
          <div className="p-6 bg-gray-800 rounded-xl border border-gray-700">
            <div className="text-3xl font-bold text-purple-400 mb-2">3</div>
            <div className="text-gray-400">Documents Available</div>
          </div>
          <div className="p-6 bg-gray-800 rounded-xl border border-gray-700">
            <div className="text-3xl font-bold text-blue-400 mb-2">19</div>
            <div className="text-gray-400">AI Agents Ready</div>
          </div>
        </div>
      </div>
    </div>
  );
}
