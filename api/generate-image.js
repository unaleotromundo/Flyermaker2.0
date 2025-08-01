const allowedOrigins = [
  "https://unaleotromundo.github.io",
  "https://tucatalogo.vercel.app",
  // Puedes agregar aquí tus dominios de producción adicionales
];

export default async function handler(req, res) {
  const origin = req.headers.origin || "";
  // Permite también cualquier subdominio temporal de Vercel (para pruebas)
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
    // Aquí iría la lógica de generación de imagen con IA.
    // Como ejemplo, devolvemos una imagen de placeholder:
    res.status(200).json({ url: "https://placehold.co/400x300.png?text=Demo+AI+Image" });
    return;
  }

  res.status(405).json({ error: "Método no permitido" });
}