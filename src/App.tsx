import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatSidebar from './components/ChatSidebar';
import ChatWindow from './components/ChatWindow';
import MobileNav from './components/MobileNav';

export interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  messages: Message[];
}

export interface Message {
  id: string;
  text: string;
  time: string;
  sent: boolean;
  read: boolean;
}

const initialChats: Chat[] = [
  {
    id: '1',
    name: 'Cipher_X',
    avatar: 'CX',
    lastMessage: 'The algorithm is ready...',
    time: '2m',
    unread: 3,
    online: true,
    messages: [
      { id: '1', text: 'Hey, you online?', time: '14:32', sent: false, read: true },
      { id: '2', text: 'Yeah, what\'s up?', time: '14:33', sent: true, read: true },
      { id: '3', text: 'I cracked the encryption layer', time: '14:35', sent: false, read: true },
      { id: '4', text: 'No way! How long did that take?', time: '14:36', sent: true, read: true },
      { id: '5', text: 'About 72 hours of runtime', time: '14:38', sent: false, read: true },
      { id: '6', text: 'The algorithm is ready...', time: '14:40', sent: false, read: false },
    ]
  },
  {
    id: '2',
    name: 'NetRunner Collective',
    avatar: 'NR',
    lastMessage: 'Ghost: Meeting at midnight',
    time: '15m',
    unread: 12,
    online: false,
    messages: [
      { id: '1', text: 'System breach detected in sector 7', time: '13:00', sent: false, read: true },
      { id: '2', text: 'On it. Deploying countermeasures.', time: '13:02', sent: true, read: true },
      { id: '3', text: 'Ghost: Meeting at midnight', time: '13:15', sent: false, read: false },
    ]
  },
  {
    id: '3',
    name: 'Nyx_404',
    avatar: 'N4',
    lastMessage: 'Check the dead drop',
    time: '1h',
    unread: 0,
    online: true,
    messages: [
      { id: '1', text: 'Package delivered', time: '12:00', sent: true, read: true },
      { id: '2', text: 'Check the dead drop', time: '12:30', sent: false, read: true },
    ]
  },
  {
    id: '4',
    name: 'DataVault_Prime',
    avatar: 'DV',
    lastMessage: 'Backup complete: 2.4TB',
    time: '3h',
    unread: 0,
    online: false,
    messages: [
      { id: '1', text: 'Initiating backup sequence...', time: '09:00', sent: false, read: true },
      { id: '2', text: 'Backup complete: 2.4TB', time: '11:30', sent: false, read: true },
    ]
  },
  {
    id: '5',
    name: 'Echo_Chamber',
    avatar: 'EC',
    lastMessage: 'Signal lost. Reconnecting...',
    time: '1d',
    unread: 1,
    online: false,
    messages: [
      { id: '1', text: 'Are you there?', time: '08:00', sent: true, read: true },
      { id: '2', text: 'Signal lost. Reconnecting...', time: '08:05', sent: false, read: false },
    ]
  },
];

function App() {
  const [chats, setChats] = useState<Chat[]>(initialChats);
  const [activeChat, setActiveChat] = useState<Chat | null>(initialChats[0]);
  const [mobileView, setMobileView] = useState<'sidebar' | 'chat'>('sidebar');
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeChat?.messages]);

  const handleSelectChat = (chat: Chat) => {
    setActiveChat(chat);
    setMobileView('chat');
  };

  const handleSendMessage = () => {
    if (!inputValue.trim() || !activeChat) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      sent: true,
      read: false,
    };

    const updatedChats = chats.map(chat => {
      if (chat.id === activeChat.id) {
        return {
          ...chat,
          messages: [...chat.messages, newMessage],
          lastMessage: inputValue,
          time: 'now',
        };
      }
      return chat;
    });

    setChats(updatedChats);
    const updatedActiveChat = updatedChats.find(c => c.id === activeChat.id);
    if (updatedActiveChat) {
      setActiveChat(updatedActiveChat);
    }
    setInputValue('');
  };

  const handleBack = () => {
    setMobileView('sidebar');
  };

  return (
    <div className="h-[100dvh] w-full bg-[#0a0a0f] overflow-hidden relative">
      {/* Scanline overlay */}
      <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.03]"
           style={{
             backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,255,0.1) 2px, rgba(0,255,255,0.1) 4px)'
           }}
      />

      {/* Ambient glow */}
      <div className="pointer-events-none fixed top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px]" />
      <div className="pointer-events-none fixed bottom-0 right-1/4 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-[100px]" />

      <div className="h-full flex flex-col">
        {/* Main content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Desktop: show both */}
          <div className="hidden md:flex w-full">
            <ChatSidebar
              chats={chats}
              activeChat={activeChat}
              onSelectChat={handleSelectChat}
            />
            <ChatWindow
              chat={activeChat}
              inputValue={inputValue}
              setInputValue={setInputValue}
              onSendMessage={handleSendMessage}
              messagesEndRef={messagesEndRef}
              onBack={handleBack}
            />
          </div>

          {/* Mobile: show one or the other */}
          <div className="md:hidden w-full h-full">
            <AnimatePresence mode="wait">
              {mobileView === 'sidebar' ? (
                <motion.div
                  key="sidebar"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="h-full"
                >
                  <ChatSidebar
                    chats={chats}
                    activeChat={activeChat}
                    onSelectChat={handleSelectChat}
                    isMobile
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="chat"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 20, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="h-full"
                >
                  <ChatWindow
                    chat={activeChat}
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                    onSendMessage={handleSendMessage}
                    messagesEndRef={messagesEndRef}
                    onBack={handleBack}
                    isMobile
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile Navigation */}
        <MobileNav activeView={mobileView} onChangeView={setMobileView} />

        {/* Footer */}
        <footer className="hidden md:block py-2 text-center border-t border-cyan-900/30 bg-[#0a0a0f]/80 backdrop-blur-sm">
          <p className="text-[10px] text-gray-600 font-mono tracking-widest uppercase">
            Requested by <span className="text-cyan-700">@rng_rn</span> · Built by <span className="text-fuchsia-700">@clonkbot</span>
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
