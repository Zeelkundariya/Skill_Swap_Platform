"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { io } from 'socket.io-client';
import { useAuthStore } from '@/store/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Send, User, MessageCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function Chat() {
  const router = useRouter();
  const { user, checkAuth } = useAuthStore();
  
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    checkAuth();
    if (!localStorage.getItem('token')) {
      router.push('/login');
    } else {
      fetchConversations();
    }
  }, []);

  useEffect(() => {
    if (activeChat) {
      fetchMessages(activeChat.user._id);
    }
  }, [activeChat]);

  useEffect(() => {
    if (!user) return;
    
    // Connect to Socket.IO
    socketRef.current = io('http://localhost:5000');
    
    socketRef.current.on('connect', () => {
      socketRef.current.emit('join_room', user._id);
    });

    socketRef.current.on('receive_message', (msg) => {
      setActiveChat((currentActiveChat) => {
        if (currentActiveChat && (msg.sender._id === currentActiveChat.user._id || msg.receiver._id === currentActiveChat.user._id)) {
          setMessages((prev) => {
            if (!prev.find(m => m._id === msg._id)) {
              return [...prev, msg];
            }
            return prev;
          });
        }
        return currentActiveChat;
      });

      setConversations((prevConvs) => {
        const otherUserId = msg.sender._id === user._id ? msg.receiver._id : msg.sender._id;
        const existingConvIndex = prevConvs.findIndex(c => c.user._id === otherUserId);
        
        let newConvs = [...prevConvs];
        if (existingConvIndex !== -1) {
          const updatedConv = { ...newConvs[existingConvIndex], lastMessage: msg };
          newConvs.splice(existingConvIndex, 1);
          newConvs.unshift(updatedConv);
        } else {
          fetchConversations();
        }
        return newConvs;
      });
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/messages/conversations/all', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        const response = await res.json();
        if (response.success) {
          setConversations(response.data);
          setActiveChat((current) => {
            if (!current && response.data.length > 0) return response.data[0];
            return current;
          });
        }
      }
    } catch (err) {
      console.error('Failed to fetch conversations', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (userId, updateLoading = true) => {
    if (updateLoading && messages.length === 0) setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/messages/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        const response = await res.json();
        if (response.success) {
          setMessages(response.data);
        }
      }
    } catch (err) {
      console.error('Failed to fetch messages', err);
    } finally {
      if (updateLoading) setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;

    const content = newMessage;
    setNewMessage('');
    
    // Optimistic UI update
    const tempMsg = {
      _id: Date.now().toString(),
      sender: { _id: user._id },
      content,
      createdAt: new Date().toISOString()
    };
    setMessages([...messages, tempMsg]);

    try {
      const res = await fetch('http://localhost:5000/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          receiverId: activeChat.user._id,
          content
        })
      });
      
      if (res.ok) {
        const response = await res.json();
        if (response.success) {
          const savedMsg = response.data;
          setMessages(prev => prev.map(m => m._id === tempMsg._id ? savedMsg : m));
          fetchConversations(); // Update last message in sidebar
        }
      }
    } catch (err) {
      console.error('Failed to send message', err);
    }
  };

  if (loading && conversations.length === 0) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="animate-pulse w-12 h-12 bg-primary rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="flex-grow max-w-7xl mx-auto w-full flex h-[calc(100vh-4rem)] bg-white border-x border-gray-100">
      
      {/* Sidebar: Conversations List */}
      <div className={`w-full md:w-80 lg:w-96 border-r border-gray-100 flex flex-col ${activeChat ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search conversations..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
        </div>

        <div className="flex-grow overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6 text-gray-400">
              <MessageCircle className="w-12 h-12 mb-3 opacity-20" />
              <p>No conversations yet.</p>
            </div>
          ) : (
            conversations.map((conv) => (
              <div 
                key={conv.user._id}
                onClick={() => setActiveChat(conv)}
                className={`p-4 border-b border-gray-50 flex items-center gap-3 cursor-pointer transition-colors ${activeChat?.user._id === conv.user._id ? 'bg-primary/5' : 'hover:bg-gray-50'}`}
              >
                <div className="relative">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center overflow-hidden">
                    {conv.user.profilePhoto ? (
                      <img src={conv.user.profilePhoto} alt={conv.user.name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-6 h-6 text-primary" />
                    )}
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                
                <div className="flex-grow overflow-hidden">
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-bold text-sm text-gray-900 truncate">{conv.user.name}</h4>
                    <span className="text-xs text-gray-400">{new Date(conv.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">
                    {conv.lastMessage.sender === user?._id ? 'You: ' : ''}{conv.lastMessage.content}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`flex-grow flex flex-col ${!activeChat ? 'hidden md:flex' : 'flex'}`}>
        {activeChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-100 flex items-center gap-3 bg-white">
              <button 
                className="md:hidden p-2 -ml-2 text-gray-500 hover:text-gray-900 transition-colors"
                onClick={() => setActiveChat(null)}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              
              <Link href={`/profile/${activeChat.user._id}`}>
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center overflow-hidden cursor-pointer">
                  {activeChat.user.profilePhoto ? (
                    <img src={activeChat.user.profilePhoto} alt={activeChat.user.name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-5 h-5 text-primary" />
                  )}
                </div>
              </Link>
              <div>
                <Link href={`/profile/${activeChat.user._id}`}>
                  <h3 className="font-bold text-gray-900 hover:underline">{activeChat.user.name}</h3>
                </Link>
                <p className="text-xs text-green-500 font-medium">Online</p>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-grow overflow-y-auto p-6 bg-gray-50 space-y-4">
              <AnimatePresence>
                {messages.map((msg, idx) => {
                  const isMe = msg.sender._id === user?._id;
                  return (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={msg._id || idx} 
                      className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[75%] rounded-2xl px-5 py-3 shadow-sm ${isMe ? 'bg-primary text-white rounded-br-none' : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'}`}>
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                        <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-blue-200' : 'text-gray-400'}`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 bg-white border-t border-gray-100">
              <form onSubmit={handleSendMessage} className="flex items-end gap-2">
                <textarea 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                  placeholder="Type a message..."
                  className="flex-grow resize-none overflow-hidden bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 min-h-[50px] max-h-[150px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                  rows="1"
                />
                <button 
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="p-3 bg-primary text-white rounded-xl hover:bg-[#152843] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center bg-gray-50 text-gray-400">
            <MessageCircle className="w-16 h-16 mb-4 opacity-20" />
            <h3 className="text-lg font-bold text-gray-600">Your Messages</h3>
            <p className="text-sm">Select a conversation or start a new one.</p>
          </div>
        )}
      </div>
    </div>
  );
}
