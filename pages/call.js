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
  const [role, setRole] = useState('caller'); // or 'receiver'

  const startCall = async () => {
    setCallStarted(true);
    const localStream = await getLocalStream();
    localVideoRef.current.srcObject = localStream;

    peerConnectionRef.current = await createPeerConnection((remoteStream) => {
      remoteVideoRef.current.srcObject = remoteStream;
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
    } else {
      const res = await fetch(`/api/call-signal?peerId=${peerId}`);
      const { signal } = await res.json();
      const answer = await createAnswer(peerConnectionRef.current, signal);

      await fetch('/api/call-signal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ peerId, signalData: answer }),
      });
    }
  };

  const receiveAnswer = async () => {
    const res = await fetch(`/api/call-signal?peerId=${peerId}`);
    const { signal } = await res.json();
    await addRemoteAnswer(peerConnectionRef.current, signal);
  };

  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">MirrorVoice Call Interface</h1>

      <div className="mb-4 flex gap-4">
        <input
          type="text"
          placeholder="Enter Peer ID"
          value={peerId}
          onChange={(e) => setPeerId(e.target.value)}
          className="border rounded p-2"
        />
        <select value={role} onChange={(e) => setRole(e.target.value)} className="border rounded p-2">
          <option value="caller">Caller</option>
          <option value="receiver">Receiver</option>
        </select>
        <button
          onClick={startCall}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h2 className="font-semibold mb-2">Your Video</h2>
          <video ref={localVideoRef} autoPlay playsInline className="w-full border rounded" />
        </div>
        <div>
          <h2 className="font-semibold mb-2">Remote Video</h2>
          <video ref={remoteVideoRef} autoPlay playsInline className="w-full border rounded" />
        </div>
      </div>
    </div>
  );
}

