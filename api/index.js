import express from 'express';
import cors from 'cors';
import 'dotenv/config';

const app = express();
app.use(express.json());

// Middleware de CORS para permitir solicitudes desde el frontend
app.use(cors({
    origin: (origin, callback) => {
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

app.options('*', cors());

// --- Tus endpoints para Gemini y generación de imágenes ---

// Endpoint 1: Para generar texto con la API de Gemini
app.post('/api/chat', async (req, res) => {
    const geminiApiKey = process.env.GEMINI_API_KEY;
    const userMessage = req.body.message;

    if (!geminiApiKey) {
        return res.status(500).json({ error: 'Clave de API de Gemini no configurada.' });
    }

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
        res.json(data);
    } catch (error) {
        console.error('Error al llamar a Gemini:', error);
        res.status(500).json({ error: 'Error del servidor al procesar el chat.' });
    }
});

// Endpoint 2: Para generar imágenes con una API dedicada (Ejemplo con DALL-E)
app.post('/api/generate-image', async (req, res) => {
    // Reemplaza 'IMAGE_API_KEY' con tu clave para el servicio de imágenes (DALL-E, Imagen, etc.)
    const imageApiKey = process.env.IMAGE_API_KEY; 
    const { prompt } = req.body;

    if (!imageApiKey) {
        return res.status(500).json({ error: 'Clave de API de imágenes no configurada.' });
    }

    try {
        // **ADAPTAR ESTO:** La URL y el 'payload' deben coincidir con la API que elijas.
        const imageUrl = `https://api.openai.com/v1/images/generations`; 
        const payload = { 
            prompt,
            model: "dall-e-3", // O el modelo que vayas a usar
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

        // El formato de la respuesta puede variar. Esto es para DALL-E.
        const imageResultUrl = data.data?.[0]?.url; 
        if (imageResultUrl) {
            res.json({ imageUrl: imageResultUrl });
        } else {
            res.status(500).json({ error: 'Respuesta inesperada de la API de imágenes.' });
        }
    } catch (error) {
        console.error('Error al llamar a la API de imágenes:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

export default app;