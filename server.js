// server.js

// Importa las librerías necesarias
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch'; 
import 'dotenv/config'; 

// Configuración del servidor
const app = express();
const port = process.env.PORT || 3000; 
const geminiApiKey = process.env.GEMINI_API_KEY; 

// Middlewares
app.use(cors()); 
app.use(express.json()); 

// Valida que la clave de API exista
if (!geminiApiKey) {
  console.error("Error: La variable de entorno GEMINI_API_KEY no está configurada.");
  process.exit(1); 
}

// Endpoint para generar texto (resumen, eslogan, descripciones)
app.post('/api/generate-text', async (req, res) => {
  const { prompt } = req.body;
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${geminiApiKey}`;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          role: "user",
          parts: [{ text: prompt }]
        }]
      }),
    });

    const result = await response.json();
    res.json(result); 
  } catch (error) {
    console.error('Error al llamar a la API de Gemini:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

// Endpoint para generar imágenes (logo)
app.post('/api/generate-image', async (req, res) => {
    const { prompt } = req.body;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${geminiApiKey}`;

    try {
        const payload = { instances: { prompt: prompt }, parameters: { "sampleCount": 1 } };
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        res.json(result);
    } catch (error) {
        console.error('Error al llamar a la API de Imagen:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor de backend escuchando en http://localhost:${port}`);
});
