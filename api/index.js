import express from 'express';
import cors from 'cors';
import 'dotenv/config';

// Si usás Node <18, instalá node-fetch y descomentá esto:
// import fetch from 'node-fetch';

const app = express();

app.use(express.json());

// Middleware global de CORS para todos los endpoints
app.use(cors({
  origin: (origin, callback) => {
    // Permite todos los subdominios de Vercel (y server-to-server)
    if (!origin || /\.vercel\.app$/.test(origin.replace(/^https?:\/\//, ''))) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  optionsSuccessStatus: 200,
}));

// Responde cualquier preflight OPTIONS antes de los endpoints
app.options('*', cors());

// --- Tus endpoints aquí abajo ---

const geminiApiKey = process.env.GEMINI_API_KEY;

// Endpoint para chat Gemini
app.post('/api/chat', async (req, res) => {
  const userMessage = req.body.message;

  if (!geminiApiKey)
    return res.status(500).json({ error: 'La clave de API no está configurada.' });

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: userMessage }
              ]
            }
          ]
        })
      }
    );
    const data = await response.json();
    if (!response.ok) {
      console.error('Error Gemini:', data);
      return res.status(response.status).json({ error: data.error?.message || 'Error de Gemini' });
    }
    res.json(data);
  } catch (error) {
    console.error('Error al llamar a Gemini:', error);
    res.status(500).json({ error: 'Error del servidor al procesar la solicitud.' });
  }
});

// Endpoint para imágenes Gemini
app.post('/api/generate-image', async (req, res) => {
  const { prompt } = req.body;
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${geminiApiKey}`;

  if (!geminiApiKey)
    return res.status(500).json({ error: 'La clave de API no está configurada.' });

  try {
    const payload = { instances: [{ prompt }], parameters: { sampleCount: 1 } };
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    if (!response.ok) {
      console.error('Error Imagen:', result);
      return res.status(response.status).json({ error: result.error?.message || 'Error de la API de Imagen' });
    }

    const base64Data = result?.predictions?.[0]?.bytesBase64Encoded;
    if (base64Data) {
      res.json({ imageUrl: `data:image/png;base64,${base64Data}` });
    } else {
      console.error('Respuesta inesperada de Imagen:', result);
      res.status(500).json({ error: 'No se pudo generar la imagen. Inténtelo de nuevo.' });
    }
  } catch (error) {
    console.error('Error al llamar a la API de Imagen:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

export default app;