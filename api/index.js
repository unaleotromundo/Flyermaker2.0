import express from 'express';
import cors from 'cors';
import 'dotenv/config';

const app = express();

app.use(express.json());

// Middleware global de CORS para todos los endpoints
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

app.options('*', (req, res, next) => {
    console.log('Preflight OPTIONS desde:', req.headers.origin);
    next();
}, cors());

// --- Endpoint unificado para chat y generación de imágenes ---

const geminiApiKey = process.env.GEMINI_API_KEY;

app.post('/api/gemini', async (req, res) => {
    const { userMessage } = req.body;

    if (!geminiApiKey) {
        return res.status(500).json({ error: 'La clave de API no está configurada.' });
    }

    const model = 'gemini-1.5-pro-latest';
    
    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`,
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
        
        // Gemini devolverá un JSON con la respuesta de texto. 
        // Si el prompt es una solicitud de imagen, la respuesta será una descripción.
        res.json(data);
    } catch (error) {
        console.error('Error al llamar a Gemini:', error);
        res.status(500).json({ error: 'Error del servidor al procesar la solicitud.' });
    }
});

export default app;