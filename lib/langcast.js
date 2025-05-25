// mirrorchat/lib/langcast.js

export async function translateText({ text, sourceLang = "English", targetLang = "Swahili", mode = "Contextual" }) {
  if (!text || typeof text !== "string") {
    console.warn("No text provided for translation.");
    return "No text provided.";
  }

  try {
    const res = await fetch("/api/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text, sourceLang, targetLang, mode }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Translation service responded with error:", err);
      return "Translation failed.";
    }

    const data = await res.json();
    return data.translated || "Translation failed.";
  } catch (err) {
    console.error("LangCast Translation Error:", err);
    return "An error occurred during translation.";
  }
}
