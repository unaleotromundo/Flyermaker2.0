export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://unaleotromundo.github.io');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    // Responder a preflight request
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    // Procesa el mensaje enviado desde el frontend
    const { message } = req.body;
    // Aquí puedes poner tu lógica de chat, por ahora responde fijo
    res.status(200).json({ reply: `Tu mensaje fue: ${message}` });
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
}