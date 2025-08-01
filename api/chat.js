export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  if (req.method === "POST") {
    const { message } = req.body;
    res.status(200).json({ reply: `Tu mensaje fue: ${message}` });
    return;
  }
  res.status(405).json({ error: "Método no permitido" });
}