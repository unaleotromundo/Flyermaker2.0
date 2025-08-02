import 'dotenv/config';

export default async function handler(req, res) {
  const geminiApiKey = process.env.GEMINI_API_KEY;
  const userMessage = req.body.message;

  if (!geminiApiKey) {
    return res.status(500).json({ error: 'Clave de API de Gemini no configurada.' });
  }

  if (req.method === 'POST') {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: userMessage }] }]
          })
        }
      );

      const data = await response.json();
      if (!response.ok) {
        console.error('Error Gemini:', data);
        return res.status(response.status).json({ error: data.error?.message || 'Error de Gemini' });
      }

      res.status(200).json(data);
    } catch (error) {
      console.error('Error al llamar a Gemini:', error);
      res.status(500).json({ error: 'Error del servidor al procesar el chat.' });
    }
  } else {
    res.status(405).json({ error: 'Método no permitido. Solo se acepta POST.' });
  }
}