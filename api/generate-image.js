import 'dotenv/config';

export default async function handler(req, res) {
  const imageApiKey = process.env.IMAGEN_API_KEY;
  const { prompt } = req.body;

  if (!imageApiKey) {
    return res.status(500).json({ error: 'Clave de API de imágenes no configurada.' });
  }

  if (req.method === 'POST') {
    try {
      const imageUrl = `https://api.openai.com/v1/images/generations`;
      const payload = {
        prompt,
        model: "dall-e-3",
        n: 1,
        size: "1024x1024"
      };

      const response = await fetch(imageUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${imageApiKey}`
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        console.error('Error en la API de imágenes:', data);
        return res.status(response.status).json({ error: data.error?.message || 'Error al generar la imagen.' });
      }

      const imageResultUrl = data.data?.[0]?.url;
      if (imageResultUrl) {
        res.status(200).json({ imageUrl: imageResultUrl });
      } else {
        res.status(500).json({ error: 'Respuesta inesperada de la API de imágenes.' });
      }
    } catch (error) {
      console.error('Error al llamar a la API de imágenes:', error);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  } else {
    res.status(405).json({ error: 'Método no permitido. Solo se acepta POST.' });
  }
}