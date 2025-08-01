const allowedOrigins = [
  "https://unaleotromundo.github.io",
  "https://tucatalogo.vercel.app",
  // Permite también cualquier deploy temporal de Vercel (solo para desarrollo/pruebas)
  // Puedes agregar más dominios aquí según necesites
];

export default async function handler(req, res) {
  const origin = req.headers.origin || "";
  // Permite cualquier subdominio temporal de Vercel durante desarrollo
  if (
    allowedOrigins.includes(origin) ||
    /^https:\/\/tucatalogo-[^.]+\.agradecidos-projects\.vercel\.app$/.test(origin)
  ) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method === "POST") {
    // Lógica para generar imagen IA:
    // const { prompt } = req.body;
    // const imageUrl = await generateAIImage(prompt);
    // Por ahora solo devuelve una imagen demo:
    res.status(200).json({ url: "https://placehold.co/400x300.png?text=Demo+AI+Image" });
    return;
  }

  res.status(405).json({ error: "Método no permitido" });
}