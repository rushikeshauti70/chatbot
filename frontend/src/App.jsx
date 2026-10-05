import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { sendPrompt } from './api/chatApi';
import { Send, Bot, User, Sun, Moon, Trash2 } from 'lucide-react';

function App() {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('chatHistory');
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const data = await sendPrompt(input);
      const botMessage = { role: 'bot', content: data.response };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage = { role: 'bot', content: 'Sorry, I encountered an error. Please try again.' };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const clearHistory = () => {
    if (window.confirm('Are you sure you want to clear the conversation?')) {
      setMessages([]);
    }
  };

  return (
    <div className={`flex flex-col h-screen ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <header className={`flex items-center justify-between p-4 border-b ${darkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'}`}>
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Bot className="text-blue-500" />
          Gemini Assistant
        </h1>
        <div className="flex gap-4">
          <button onClick={clearHistory} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors" aria-label="Clear History">
            <Trash2 size={20} />
          </button>
          <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors" aria-label="Toggle Theme">
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-3xl mx-auto flex flex-col gap-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
              <Bot size={48} className="mb-4 text-blue-500 opacity-50" />
              <h2 className="text-2xl font-semibold mb-2 text-gray-700 dark:text-gray-300">How can I help you today?</h2>
              <p>Type a message below to start the conversation.</p>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'bot' && (
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
                    <Bot size={16} className="text-white" />
                  </div>
                )}
                <div className={`max-w-[85%] rounded-2xl p-4 ${msg.role === 'user' ? 'bg-blue-600 text-white' : darkMode ? 'bg-gray-800' : 'bg-white shadow-md'}`}>
                  {msg.role === 'user' ? (
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  ) : (
                    <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          code({node, inline, className, children, ...props}) {
                            const match = /language-(\w+)/.exec(className || '')
                            return !inline && match ? (
                              <SyntaxHighlighter
                                {...props}
                                children={String(children).replace(/\n$/, '')}
                                style={materialDark}
                                language={match[1]}
                                PreTag="div"
                                className="rounded-md"
                              />
                            ) : (
                              <code {...props} className={`${className} bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded`}>
                                {children}
                              </code>
                            )
                          }
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center shrink-0">
                    <User size={16} className="text-gray-600 dark:text-gray-300" />
                  </div>
                )}
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex gap-4 justify-start">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
                <Bot size={16} className="text-white" />
              </div>
              <div className={`max-w-[85%] rounded-2xl p-4 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-md'}`}>
                <div className="flex gap-1 items-center h-6">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <footer className={`p-4 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border-t`}>
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className={`relative flex items-end rounded-2xl border ${darkMode ? 'border-gray-700 bg-gray-800 focus-within:border-blue-500' : 'border-gray-300 bg-white focus-within:border-blue-500'} transition-colors overflow-hidden`}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message Gemini..."
              className="w-full max-h-48 p-4 pr-12 bg-transparent outline-none resize-none placeholder-gray-500"
              rows={1}
              style={{ minHeight: '56px' }}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className={`absolute right-2 bottom-2 p-2 rounded-xl transition-colors ${!input.trim() || isLoading ? 'text-gray-400 cursor-not-allowed' : 'text-white bg-blue-600 hover:bg-blue-700'}`}
            >
              <Send size={20} />
            </button>
          </form>
          <div className="text-center mt-2 text-xs text-gray-500">
            Gemini Assistant can make mistakes. Consider verifying important information.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
