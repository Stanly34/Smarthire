import React, { useEffect, useState, useRef } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';
import { connectSocket, getSocket } from '../services/socket';
import { useAuth } from '../context/AuthContext';

export default function Chat() {
  const { user, getToken } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const token = getToken();
    if (!token) return;
    const socket = connectSocket(token);

    socket.on('receive_message', (msg) => {
      setMessages(prev => [...prev, msg]);
      // Refresh contacts list so last_message updates
      api.get('/chat/contacts').then(res => setContacts(res.data)).catch(() => {});
    });

    socket.on('message_sent', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err.message);
    });

    api.get('/chat/contacts').then(res => setContacts(res.data)).catch(console.error);

    return () => {
      socket.off('receive_message');
      socket.off('message_sent');
      socket.off('connect_error');
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const openConversation = async (contact) => {
    setActiveContact(contact);
    try {
      const res = await api.get(`/chat/messages/${contact.other_id}`);
      setMessages(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const sendMessage = async () => {
    if (!newMsg.trim() || !activeContact) return;
    setSending(true);
    try {
      const socket = getSocket();
      if (socket) {
        socket.emit('send_message', { receiver_id: activeContact.other_id, content: newMsg });
      } else {
        await api.post('/chat/send', { receiver_id: activeContact.other_id, content: newMsg });
        const res = await api.get(`/chat/messages/${activeContact.other_id}`);
        setMessages(res.data);
      }
      setNewMsg('');
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  return (
    <Layout title="Messages">
      <div className="flex gap-4 h-[calc(100vh-160px)]">
        {/* Contacts sidebar */}
        <div className="w-72 card overflow-y-auto">
          <h3 className="font-bold text-gray-900 mb-3">Conversations</h3>
          {contacts.length === 0 ? (
            <p className="text-gray-400 text-sm text-center mt-8">No conversations yet</p>
          ) : (
            <div className="space-y-1">
              {contacts.map(c => (
                <button
                  key={c.other_id}
                  onClick={() => openConversation(c)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${activeContact?.other_id === c.other_id ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'}`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                      {(c.display_name || c.other_email || '?')[0].toUpperCase()}
                    </div>
                    <div className="overflow-hidden">
                      <div className="font-medium text-sm truncate">{c.display_name || c.other_email}</div>
                      <div className="text-xs text-gray-400 truncate">{c.last_message}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Chat panel */}
        <div className="flex-1 card flex flex-col overflow-hidden">
          {!activeContact ? (
            <div className="flex-1 flex items-center justify-center text-gray-400 flex-col gap-2">
              <div className="text-4xl">💬</div>
              <div>Select a conversation to start chatting</div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="border-b pb-3 mb-4">
                <div className="font-bold">{activeContact.display_name || activeContact.other_email}</div>
                <div className="text-xs text-gray-400 capitalize">{activeContact.other_role}</div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-1">
                {messages.map((msg, i) => {
                  const isMine = msg.sender_id === user?.id;
                  return (
                    <div key={i} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${isMine ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'}`}>
                        {msg.content}
                        <div className={`text-xs mt-1 ${isMine ? 'text-blue-200' : 'text-gray-400'}`}>
                          {msg.sent_at ? new Date(msg.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="flex gap-2">
                <input
                  className="input flex-1"
                  value={newMsg}
                  onChange={e => setNewMsg(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
                  placeholder="Type a message..."
                />
                <button onClick={sendMessage} disabled={sending || !newMsg.trim()} className="btn-primary px-4">
                  {sending ? '...' : '→'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
