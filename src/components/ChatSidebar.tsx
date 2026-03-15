import { motion } from 'framer-motion';
import type { Chat } from '../App';

interface ChatSidebarProps {
  chats: Chat[];
  activeChat: Chat | null;
  onSelectChat: (chat: Chat) => void;
  isMobile?: boolean;
}

function ChatSidebar({ chats, activeChat, onSelectChat, isMobile }: ChatSidebarProps) {
  return (
    <div className={`${isMobile ? 'w-full' : 'w-80 lg:w-96'} h-full bg-[#0d0d14] border-r border-cyan-900/30 flex flex-col`}>
      {/* Header */}
      <div className="p-4 border-b border-cyan-900/30">
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-display text-xl md:text-2xl font-bold tracking-tight">
            <span className="text-cyan-400">PULSE</span>
            <span className="text-fuchsia-500">_</span>
            <span className="text-gray-400 text-xs ml-1 font-mono">v2.0</span>
          </h1>
          <div className="flex gap-2">
            <button className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-cyan-400 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-cyan-400 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search transmissions..."
            className="w-full bg-[#0a0a0f] border border-cyan-900/50 rounded-none px-4 py-3 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 focus:shadow-[0_0_10px_rgba(0,255,255,0.1)] transition-all font-mono"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600">
            <kbd className="text-[10px] bg-gray-800 px-1.5 py-0.5 rounded font-mono">/</kbd>
          </div>
        </div>
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {chats.map((chat, index) => (
          <motion.button
            key={chat.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onSelectChat(chat)}
            className={`w-full p-4 flex items-start gap-3 border-b border-cyan-900/20 transition-all hover:bg-cyan-950/20 group relative
              ${activeChat?.id === chat.id ? 'bg-cyan-950/30' : ''}`}
          >
            {/* Active indicator */}
            {activeChat?.id === chat.id && (
              <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-cyan-400 to-fuchsia-500" />
            )}

            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className={`w-12 h-12 flex items-center justify-center text-sm font-bold font-mono
                ${chat.online ? 'bg-gradient-to-br from-cyan-500/20 to-fuchsia-500/20 text-cyan-400' : 'bg-gray-800/50 text-gray-500'}
                clip-avatar`}>
                {chat.avatar}
              </div>
              {chat.online && (
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-cyan-400 border-2 border-[#0d0d14] rounded-full animate-pulse" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className={`font-medium truncate ${chat.online ? 'text-gray-200' : 'text-gray-400'} group-hover:text-cyan-300 transition-colors`}>
                  {chat.name}
                </span>
                <span className="text-[10px] text-gray-600 font-mono flex-shrink-0">{chat.time}</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm text-gray-500 truncate font-light">{chat.lastMessage}</p>
                {chat.unread > 0 && (
                  <span className="flex-shrink-0 min-w-[20px] h-5 px-1.5 flex items-center justify-center text-[10px] font-bold bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-black rounded-sm">
                    {chat.unread}
                  </span>
                )}
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Status bar */}
      <div className="p-3 border-t border-cyan-900/30 bg-[#080810]">
        <div className="flex items-center justify-between text-[10px] font-mono text-gray-600">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
            <span>ENCRYPTED</span>
          </div>
          <span>NODE: 42.7.128</span>
        </div>
      </div>
    </div>
  );
}

export default ChatSidebar;
