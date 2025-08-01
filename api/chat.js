const allowedOrigins = [
  "https://unaleotromundo.github.io",
  "https://tucatalogo-35tnwbrtv-agradecidos-projects.vercel.app",
  "https://tucatalogo.vercel.app"
];

export default function handler(req, res) {
  const origin = req.headers.origin || "";
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  // Si la petición es preflight OPTIONS, responde rápido
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  if (req.method === "POST") {
    const { message } = req.body;
    // Aquí puedes poner tu lógica real de chat
    res.status(200).json({ reply: `Tu mensaje fue: ${message}` });
    return;
  }
  res.status(405).json({ error: "Método no permitido" });
}