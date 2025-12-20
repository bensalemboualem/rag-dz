"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, Loader2 } from "lucide-react";
import { useThemeStore, useLocaleStore, useChatStore } from "@/lib/store";
import { t } from "@/lib/i18n";

export default function ChatHelp() {
  const { theme } = useThemeStore();
  const { locale } = useLocaleStore();
  const { isOpen, messages, toggle, addMessage } = useChatStore();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    addMessage("user", userMessage);
    setIsLoading(true);

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const responses: Record<string, string[]> = {
        fr: [
          "Je suis là pour vous aider avec IA Factory Studio ! Que souhaitez-vous savoir ?",
          "Pour générer une vidéo, allez dans le Studio et décrivez votre scène.",
          "L'éditeur vous permet de monter vos vidéos avec une timeline professionnelle.",
          "Vous pouvez ajouter des voix en Darija grâce à notre synthèse vocale IA.",
        ],
        ar: [
          "أنا هنا لمساعدتك في IA Factory Studio! ماذا تريد أن تعرف؟",
          "لتوليد فيديو، اذهب إلى الاستوديو وصف مشهدك.",
          "المحرر يسمح لك بمونتاج الفيديوهات مع تايم لاين احترافي.",
          "يمكنك إضافة أصوات بالدارجة بفضل تركيب الصوت بالذكاء الاصطناعي.",
        ],
        en: [
          "I'm here to help you with IA Factory Studio! What would you like to know?",
          "To generate a video, go to the Studio and describe your scene.",
          "The editor allows you to edit your videos with a professional timeline.",
          "You can add Darija voices thanks to our AI voice synthesis.",
        ],
      };

      const randomResponse =
        responses[locale][Math.floor(Math.random() * responses[locale].length)];
      addMessage("assistant", randomResponse);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={toggle}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all ${
          isOpen
            ? "bg-red-500 hover:bg-red-600"
            : "bg-gradient-to-r from-cyan-400 to-fuchsia-500 hover:shadow-cyan-500/50"
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`fixed bottom-24 right-6 z-50 w-96 h-[500px] rounded-2xl shadow-2xl overflow-hidden flex flex-col ${
              theme === "dark"
                ? "bg-[#141419] border border-[#2a2a35]"
                : "bg-white border border-gray-200"
            }`}
          >
            {/* Header */}
            <div className="px-4 py-3 bg-gradient-to-r from-cyan-500 to-fuchsia-500">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{t("chat.title", locale)}</h3>
                  <p className="text-xs text-white/80">IA Factory Assistant</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <Bot
                    className={`w-12 h-12 mx-auto mb-4 ${
                      theme === "dark" ? "text-gray-600" : "text-gray-300"
                    }`}
                  />
                  <p
                    className={`text-sm ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {t("chat.placeholder", locale)}
                  </p>
                </div>
              )}

              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${
                    msg.role === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      msg.role === "user"
                        ? "bg-gradient-to-r from-cyan-400 to-fuchsia-500"
                        : theme === "dark"
                        ? "bg-[#2a2a35]"
                        : "bg-gray-100"
                    }`}
                  >
                    {msg.role === "user" ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot
                        className={`w-4 h-4 ${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }`}
                      />
                    )}
                  </div>
                  <div
                    className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${
                      msg.role === "user"
                        ? "bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white"
                        : theme === "dark"
                        ? "bg-[#1a1a24] text-gray-200"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <div className="flex gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      theme === "dark" ? "bg-[#2a2a35]" : "bg-gray-100"
                    }`}
                  >
                    <Bot
                      className={`w-4 h-4 ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    />
                  </div>
                  <div
                    className={`px-4 py-3 rounded-2xl ${
                      theme === "dark" ? "bg-[#1a1a24]" : "bg-gray-100"
                    }`}
                  >
                    <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div
              className={`p-4 border-t ${
                theme === "dark" ? "border-[#2a2a35]" : "border-gray-200"
              }`}
            >
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t("chat.placeholder", locale)}
                  className={`flex-1 px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/50 ${
                    theme === "dark"
                      ? "bg-[#1a1a24] border border-[#2a2a35] text-white placeholder:text-gray-500"
                      : "bg-gray-100 text-gray-900 placeholder:text-gray-400"
                  }`}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-400 to-fuchsia-500 flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
