// mirrorchat/pages/chat.js

import { useState, useEffect } from 'react';
import ChatBox from '../components/ChatBox';
import TranslatePanel from '../components/TranslatePanel';

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    fetch('/api/messages')
      .then((res) => res.json())
      .then((data) => setMessages(data));
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: input }),
    });

    const newMsg = await res.json();
    setMessages((prev) => [...prev, newMsg]);
    setInput('');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">MirrorChat</h1>
      <div className="bg-white rounded shadow p-4 max-w-xl mx-auto">
        <ChatBox messages={messages} />
        <TranslatePanel
          input={input}
          onChange={(e) => setInput(e.target.value)}
          onSend={sendMessage}
        />
      </div>
    </div>
  );
}


