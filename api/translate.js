export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Only POST allowed.' });
  }

  const {
    text,
    sourceLang = 'English',
    targetLang = 'Swahili',
    mode = 'Contextual',
  } = req.body;

  if (!text || typeof text !== 'string' || !text.trim()) {
    return res.status(400).json({ error: 'Text is required and must be a non-empty string.' });
  }

  const prompt = `You are a ${targetLang} language translator. Translate the user's ${sourceLang} text to ${targetLang} using ${mode} mode. Keep it natural and accurate.
Text: ${text.trim()}`;

  try {
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are a helpful and accurate translator." },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
      }),
    });

    if (!openaiRes.ok) {
      const errorText = await openaiRes.text();
      console.error("OpenAI response error:", errorText);
      return res.status(502).json({ error: 'Translation service failed.' });
    }

    const result = await openaiRes.json();
    const translated = result.choices?.[0]?.message?.content || "Translation failed.";
    res.status(200).json({ translated });

  } catch (err) {
    console.error("Translation error:", err);
    res.status(500).json({ error: 'Internal server error during translation.' });
  }
}
