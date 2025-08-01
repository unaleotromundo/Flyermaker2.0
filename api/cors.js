// Middleware CORS reutilizable para Next.js API routes
const allowedOrigins = [
  "https://unaleotromundo.github.io",
  "https://tucatalogo.vercel.app"
];

const vercelPreviewRegex = /^https:\/\/tucatalogo-[^.]+\.agradecidos-projects\.vercel\.app$/;

export function applyCORS(req, res) {
  const origin = req.headers.origin || "";
  if (allowedOrigins.includes(origin) || vercelPreviewRegex.test(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  // Si OPTIONS, responde rápido y termina
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return true; // Indica que ya respondimos
  }
  return false; // Indica que debe seguir la ejecución normal
}