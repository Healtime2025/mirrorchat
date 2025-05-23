// mirrorchat/api/messages.js

let messages = [];

export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json(messages);
  } else if (req.method === 'POST') {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Message text is required.' });
    }
    const newMessage = {
      text,
      timestamp: Date.now(),
    };
    messages.push(newMessage);
    res.status(201).json(newMessage);
  } else {
    res.status(405).json({ error: 'Method not allowed.' });
  }
}
