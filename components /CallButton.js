import React from 'react';

export default function CallButton({ onCall }) {
  return (
    <button
      onClick={onCall}
      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
    >
      Call
    </button>
  );
}

