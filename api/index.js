// api/index.js
import express from 'express';
import cors from 'cors';
import 'dotenv/config'; 

const app = express();

app.use(express.json());
app.use(cors());

// Usa la clave de API para ambos endpoints.
const geminiApiKey = process.env.GEMINI_API_KEY; 

// Endpoint para el chat de Gemini
app.post('/api/chat', async (req, res) => {
    const userMessage = req.body.message;
    
    if (!geminiApiKey) {
        return res.status(500).json({ error: 'La clave de API no está configurada.' });
    }

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "contents": [
                    {
                        "parts": [
                            {
                                "text": userMessage
                            }
                        ]
                    }
                ]
            })
        });

        const data = await response.json();
        res.json(data);

    } catch (error) {
        console.error('Error al llamar a la API de Gemini:', error);
        res.status(500).json({ error: 'Error del servidor al procesar la solicitud.' });
    }
});

// Endpoint para generar imágenes
app.post('/api/generate-image', async (req, res) => {
    const { prompt } = req.body;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${geminiApiKey}`;

    try {
        const payload = { instances: [{ prompt: prompt }], parameters: { "sampleCount": 1 } };
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error de la API de Imagen:', response.status, errorText);
            return res.status(response.status).json({ error: `Error de la API: ${errorText}` });
        }

        const result = await response.json();
        const base64Data = result?.predictions?.[0]?.bytesBase64Encoded;

        if (base64Data) {
            res.json({ imageUrl: `data:image/png;base64,${base64Data}` });
        } else {
            console.error('La respuesta de la API no contiene datos de imagen esperados.');
            res.status(500).json({ error: 'No se pudo generar la imagen. Inténtelo de nuevo.' });
        }

    } catch (error) {
        console.error('Error al llamar a la API de Imagen:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

// Exporta la aplicación Express para Vercel
export default app;