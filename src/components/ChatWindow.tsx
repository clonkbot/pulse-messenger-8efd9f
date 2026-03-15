import { RefObject } from 'react';
import { motion } from 'framer-motion';
import type { Chat } from '../App';

interface ChatWindowProps {
  chat: Chat | null;
  inputValue: string;
  setInputValue: (value: string) => void;
  onSendMessage: () => void;
  messagesEndRef: RefObject<HTMLDivElement>;
  onBack: () => void;
  isMobile?: boolean;
}

function ChatWindow({ chat, inputValue, setInputValue, onSendMessage, messagesEndRef, onBack, isMobile }: ChatWindowProps) {
  if (!chat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#0a0a0f]">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 border border-cyan-900/50 flex items-center justify-center">
            <svg className="w-12 h-12 text-cyan-900/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <p className="text-gray-600 font-mono text-sm">SELECT A TRANSMISSION</p>
        </div>
      </div>
    );
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0a0a0f] h-full">
      {/* Header */}
      <div className="p-3 md:p-4 border-b border-cyan-900/30 bg-[#0d0d14]/80 backdrop-blur-sm flex items-center gap-3">
        {isMobile && (
          <button
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-cyan-400 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        <div className="relative flex-shrink-0">
          <div className={`w-10 h-10 md:w-11 md:h-11 flex items-center justify-center text-xs font-bold font-mono
            ${chat.online ? 'bg-gradient-to-br from-cyan-500/20 to-fuchsia-500/20 text-cyan-400' : 'bg-gray-800/50 text-gray-500'}
            clip-avatar`}>
            {chat.avatar}
          </div>
          {chat.online && (
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-cyan-400 border-2 border-[#0d0d14] rounded-full" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h2 className="font-medium text-gray-200 truncate">{chat.name}</h2>
          <p className="text-xs font-mono text-gray-500">
            {chat.online ? (
              <span className="text-cyan-500">ONLINE // SECURE CHANNEL</span>
            ) : (
              'LAST SEEN: 2H AGO'
            )}
          </p>
        </div>

        <div className="flex items-center gap-1 md:gap-2">
          <button className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-cyan-400 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </button>
          <button className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-cyan-400 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-4 custom-scrollbar">
        {chat.messages.map((message, index) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.02 }}
            className={`flex ${message.sent ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] md:max-w-[70%] p-3 md:p-4 relative group
                ${message.sent
                  ? 'bg-gradient-to-br from-cyan-900/40 to-cyan-950/60 border border-cyan-700/30 message-sent'
                  : 'bg-gray-900/80 border border-gray-800/50 message-received'
                }`}
            >
              <p className="text-sm md:text-base text-gray-200 leading-relaxed break-words">{message.text}</p>
              <div className={`flex items-center gap-2 mt-2 ${message.sent ? 'justify-end' : 'justify-start'}`}>
                <span className="text-[10px] font-mono text-gray-600">{message.time}</span>
                {message.sent && (
                  <span className={`text-[10px] ${message.read ? 'text-cyan-500' : 'text-gray-600'}`}>
                    {message.read ? '// READ' : '// SENT'}
                  </span>
                )}
              </div>

              {/* Glitch effect on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-fuchsia-500/5" />
              </div>
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 md:p-4 border-t border-cyan-900/30 bg-[#0d0d14]/80 backdrop-blur-sm">
        <div className="flex items-end gap-2 md:gap-3">
          <button className="w-11 h-11 flex-shrink-0 flex items-center justify-center text-gray-500 hover:text-cyan-400 transition-colors border border-cyan-900/30 hover:border-cyan-700/50">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>

          <div className="flex-1 relative">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Transmit message..."
              rows={1}
              className="w-full bg-[#0a0a0f] border border-cyan-900/50 px-4 py-3 text-sm md:text-base text-gray-200 placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 focus:shadow-[0_0_15px_rgba(0,255,255,0.1)] transition-all resize-none font-light"
              style={{ minHeight: '44px', maxHeight: '120px' }}
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onSendMessage}
            disabled={!inputValue.trim()}
            className="w-11 h-11 flex-shrink-0 flex items-center justify-center bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-black hover:from-cyan-400 hover:to-fuchsia-400 transition-all disabled:opacity-30 disabled:cursor-not-allowed clip-button"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </motion.button>
        </div>

        {/* Typing indicator (decorative) */}
        <div className="mt-2 flex items-center gap-2 text-[10px] font-mono text-gray-600">
          <span className="w-2 h-2 bg-fuchsia-500/50 rounded-full animate-pulse" />
          <span>E2E ENCRYPTED // QUANTUM RESISTANT</span>
        </div>
      </div>

      {/* Mobile footer */}
      {isMobile && (
        <div className="py-2 text-center border-t border-cyan-900/30 bg-[#0a0a0f]/80">
          <p className="text-[10px] text-gray-600 font-mono tracking-widest uppercase">
            Requested by <span className="text-cyan-700">@rng_rn</span> · Built by <span className="text-fuchsia-700">@clonkbot</span>
          </p>
        </div>
      )}
    </div>
  );
}

export default ChatWindow;
