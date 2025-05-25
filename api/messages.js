// mirrorchat/api/messages.js

let messages = [];

export default function handler(req, res) {
  const { method } = req;

  if (method === 'GET') {
    return res.status(200).json(messages);
  }

  if (method === 'POST') {
    const { text } = req.body;

    if (!text || typeof text !== 'string' || text.trim() === '') {
      return res.status(400).json({ error: 'Message text is required and must be a string.' });
    }

    const newMessage = {
      text: text.trim(),
      timestamp: Date.now(),
    };

    messages.push(newMessage);
    return res.status(201).json(newMessage);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).json({ error: `Method ${method} not allowed.` });
}
