import React from 'react';

export default function TranslatePanel({ input, onChange, onSend }) {
  return (
    <div className="flex gap-2 mt-4">
      <input
        type="text"
        className="flex-1 border rounded p-2"
        placeholder="Type your message..."
        value={input}
        onChange={onChange}
      />
      <button
        onClick={onSend}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Send
      </button>
    </div>
  );
}
