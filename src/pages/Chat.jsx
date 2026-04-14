import React, { useEffect, useState, useRef } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const CONTACT_POLL_MS = 5000;
const MESSAGE_POLL_MS = 3000;

export default function Chat() {
  const { user } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const loadContacts = async () => {
    const res = await api.get('/chat/contacts');
    setContacts(res.data);
  };

  const loadMessages = async (contact = activeContact) => {
    if (!contact?.other_id) return;
    const res = await api.get(`/chat/messages/${contact.other_id}`);
    setMessages(res.data);
  };

  useEffect(() => {
    if (!user?.id) return;
    let isMounted = true;

    const refreshContacts = async () => {
      try {
        const res = await api.get('/chat/contacts');
        if (isMounted) setContacts(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    refreshContacts();
    const intervalId = window.setInterval(refreshContacts, CONTACT_POLL_MS);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, [user?.id]);

  useEffect(() => {
    if (!activeContact?.other_id) {
      setMessages([]);
      return;
    }

    let isMounted = true;
    const contact = activeContact;

    const refreshMessages = async () => {
      try {
        const res = await api.get(`/chat/messages/${contact.other_id}`);
        if (isMounted) setMessages(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    refreshMessages();
    const intervalId = window.setInterval(refreshMessages, MESSAGE_POLL_MS);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, [activeContact?.other_id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const openConversation = async (contact) => {
    setActiveContact(contact);
    try {
      await loadMessages(contact);
    } catch (err) {
      console.error(err);
    }
  };

  const sendMessage = async () => {
    if (!newMsg.trim() || !activeContact) return;
    setSending(true);
    try {
      await api.post('/chat/send', { receiver_id: activeContact.other_id, content: newMsg });
      setNewMsg('');
      await Promise.all([loadMessages(), loadContacts()]);
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
              <div className="text-4xl">MSG</div>
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
                  {sending ? '...' : 'Send'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
