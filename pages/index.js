import { useEffect, useState } from 'react';

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [showSplash, setShowSplash] = useState(true);

  // Show splash screen for 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Fetch messages
  useEffect(() => {
    fetch('/api/messages')
      .then(res => res.json())
      .then(data => setMessages(data));
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: input })
    });
    const newMsg = await res.json();
    setMessages(prev => [...prev, newMsg]);
    setInput('');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 relative">
      {/* 👁 Splash Screen */}
      {showSplash && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-black text-white z-50 transition-opacity duration-700">
          <div className="text-3xl font-bold mb-4 animate-pulse">👁 MirrorChat</div>
          <div className="text-sm text-gray-300 mb-4">Preparing your encrypted reality...</div>
          <div className="w-24 h-1 bg-blue-500 animate-ping rounded-full"></div>
        </div>
      )}

      <h1 className="text-2xl font-bold mb-4">MirrorChat - Phase 1</h1>
      <div className="bg-white rounded shadow p-4 max-w-xl mx-auto">
        <div className="h-80 overflow-y-scroll border mb-4 p-2">
          {messages.map((msg, i) => (
            <div key={i} className="mb-2 text-gray-800">{msg.text}</div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 border rounded p-2"
            placeholder="Type your message..."
            value={input}
            onChange={e => setInput(e.target.value)}
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

