// api/ai.js — Usa Groq (GRATIS, sin tarjeta de crédito)
// Modelo: Llama 3.3 70B — muy capaz y rápido
import https from "https";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "GROQ_API_KEY no configurada en Vercel" });

  const { messages, system, max_tokens } = req.body;

  // Convertir formato Anthropic → Groq/OpenAI
  const groqMessages = [];
  if (system) groqMessages.push({ role: "system", content: system });
  groqMessages.push(...(messages || []));

  const body = JSON.stringify({
    model: "llama-3.3-70b-versatile",
    messages: groqMessages,
    max_tokens: max_tokens || 500,
    temperature: 0.7,
  });

  return new Promise((resolve) => {
    const options = {
      hostname: "api.groq.com",
      path: "/openai/v1/chat/completions",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(body),
        "Authorization": `Bearer ${apiKey}`,
      },
    };

    const request = https.request(options, (response) => {
      let data = "";
      response.on("data", (chunk) => { data += chunk; });
      response.on("end", () => {
        try {
          const parsed = JSON.parse(data);
          const text = parsed.choices?.[0]?.message?.content || "Sin respuesta";
          // Responder en formato Anthropic para que el frontend no cambie
          res.status(200).json({ content: [{ type: "text", text }] });
        } catch {
          res.status(500).json({ error: "Error al procesar respuesta", raw: data });
        }
        resolve();
      });
    });

    request.on("error", (err) => {
      res.status(500).json({ error: err.message });
      resolve();
    });

    request.write(body);
    request.end();
  });
}
