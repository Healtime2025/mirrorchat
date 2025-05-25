import { useEffect, useRef, useState } from 'react';
import {
  createPeerConnection,
  getLocalStream,
  createOffer,
  createAnswer,
  addRemoteAnswer,
} from '../lib/webrtc';

export default function CallPage() {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);

  const [callStarted, setCallStarted] = useState(false);
  const [peerId, setPeerId] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('idle'); // idle | connecting | error

  const startCall = async () => {
    if (!peerId || !role) return alert('Please enter Peer ID and select a role.');

    try {
      setCallStarted(true);
      setStatus('connecting');

      const localStream = await getLocalStream();
      if (localVideoRef.current) localVideoRef.current.srcObject = localStream;

      peerConnectionRef.current = await createPeerConnection((remoteStream) => {
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;
      });

      localStream.getTracks().forEach((track) => {
        peerConnectionRef.current.addTrack(track, localStream);
      });

      if (role === 'caller') {
        const offer = await createOffer(peerConnectionRef.current);
        await fetch('/api/call-signal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ peerId, signalData: offer }),
        });
      } else if (role === 'receiver') {
        const res = await fetch(`/api/call-signal?peerId=${peerId}`);
        const { signal } = await res.json();
        const answer = await createAnswer(peerConnectionRef.current, signal);

        await fetch('/api/call-signal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ peerId, signalData: answer }),
        });
      }

      setStatus('idle');
    } catch (err) {
      console.error('Call error:', err);
      setStatus('error');
    }
  };

  const receiveAnswer = async () => {
    try {
      const res = await fetch(`/api/call-signal?peerId=${peerId}`);
      const { signal } = await res.json();
      await addRemoteAnswer(peerConnectionRef.current, signal);
    } catch (err) {
      console.error('Answer error:', err);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">MirrorVoice Call Interface</h1>

      <div className="mb-4 flex gap-4 flex-wrap">
        <input
          type="text"
          placeholder="Enter Peer ID"
          value={peerId}
          onChange={(e) => setPeerId(e.target.value)}
          className="border rounded p-2"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border rounded p-2"
        >
          <option value="">Select Role</option>
          <option value="caller">Caller</option>
          <option value="receiver">Receiver</option>
        </select>
        <button
          onClick={startCall}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          disabled={!peerId || !role || callStarted}
        >
          Start Call
        </button>
        {role === 'caller' && callStarted && (
          <button
            onClick={receiveAnswer}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Connect
          </button>
        )}
      </div>

      {/* Status messages */}
      {status === 'connecting' && (
        <div className="text-blue-600 text-sm mb-4 animate-pulse">Connecting...</div>
      )}
      {status === 'error' && (
        <div className="text-red-600 text-sm mb-4">Something went wrong. Please try again.</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2 className="font-semibold mb-2">Your Video</h2>
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full border rounded"
          />
        </div>
        <div>
          <h2 className="font-semibold mb-2">Remote Video</h2>
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full border rounded"
          />
        </div>
      </div>
    </div>
  );
}
