// mirrorchat/api/call-signal.js

// In-memory signal store (temporary)
const peers = {};

export default function handler(req, res) {
  const { method } = req;

  if (method === 'POST') {
    const { peerId, signalData } = req.body;

    if (!peerId || !signalData) {
      console.warn('Invalid POST: Missing peerId or signalData.');
      return res.status(400).json({ error: 'Missing peerId or signalData.' });
    }

    peers[peerId] = signalData;
    console.log(`[Signal Stored] peerId: ${peerId}`);
    return res.status(200).json({ status: 'Signal stored' });
  }

  if (method === 'GET') {
    const { peerId } = req.query;

    if (!peerId) {
      return res.status(400).json({ error: 'Missing peerId.' });
    }

    if (!peers[peerId]) {
      return res.status(404).json({ error: 'Signal not found.' });
    }

    const signal = peers[peerId];
    delete peers[peerId];
    console.log(`[Signal Retrieved] peerId: ${peerId}`);
    return res.status(200).json({ signal });
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).json({ error: `Method ${method} not allowed` });
}
