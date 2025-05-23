// mirrorchat/api/call-signal.js

let peers = {};

export default function handler(req, res) {
  const { method, body } = req;

  if (method === 'POST') {
    const { peerId, signalData } = body;
    if (!peerId || !signalData) {
      return res.status(400).json({ error: 'Missing peerId or signalData.' });
    }
    peers[peerId] = signalData;
    return res.status(200).json({ status: 'Signal stored' });
  }

  if (method === 'GET') {
    const { peerId } = req.query;
    if (!peerId || !peers[peerId]) {
      return res.status(404).json({ error: 'Signal not found.' });
    }
    const signal = peers[peerId];
    delete peers[peerId];
    return res.status(200).json({ signal });
  }

  res.status(405).json({ error: 'Method not allowed' });
}

