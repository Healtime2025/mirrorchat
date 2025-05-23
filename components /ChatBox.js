import React from 'react';

export default function ChatBox({ messages }) {
  return (
    <div className="h-80 overflow-y-scroll border mb-4 p-2 bg-white rounded shadow">
      {messages.length === 0 ? (
        <div className="text-gray-400 italic">No messages yet...</div>
      ) : (
        messages.map((msg, i) => (
          <div key={i} className="mb-2 text-gray-800">
            {msg.text}
          </div>
        ))
      )}
    </div>
  );
}
wdwdw
