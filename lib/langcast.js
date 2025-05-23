// mirrorchat/lib/langcast.js

export async function translateText({ text, sourceLang = "English", targetLang = "Swahili", mode = "Contextual" }) {
  try {
    const res = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, sourceLang, targetLang, mode }),
    });

    if (!res.ok) {
      throw new Error("Translation failed.");
    }

    const data = await res.json();
    return data.translated || "Translation error.";
  } catch (err) {
    console.error("LangCast Translation Error:", err);
    return "An error occurred during translation.";
  }
}

