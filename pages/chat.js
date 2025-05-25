import { useState, useEffect } from 'react';
import ChatBox from '../components/ChatBox';
import TranslatePanel from '../components/TranslatePanel';

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error

  useEffect(() => {
    fetch('/api/messages')
      .then((res) => res.json())
      .then((data) => setMessages(data))
      .catch(() => setStatus('error'));
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setStatus('sending');

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input }),
      });

      const newMsg = await res.json();
      setMessages((prev) => [...prev, newMsg]);
      setInput('');
      setStatus('sent');

      setTimeout(() => setStatus('idle'), 1000);
    } catch (err) {
      setStatus('error');
    }
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

        {/* 👁 Status Bar */}
        {status === 'sending' && (
          <div className="text-sm text-blue-500 mt-2 animate-pulse">Sending...</div>
        )}
        {status === 'sent' && (
          <div className="text-sm text-green-600 mt-2 animate-bounce">✅ Message sent</div>
        )}
        {status === 'error' && (
          <div className="text-sm text-red-600 mt-2">⚠️ Failed to send message.</div>
        )}
      </div>
    </div>
  );
}

