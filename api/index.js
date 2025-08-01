// api/index.js
import express from 'express';
import cors from 'cors';
import 'dotenv/config'; 

const app = express();

// Ya no necesitas la configuración de corsOptions
app.use(express.json());

const geminiApiKey = process.env.GEMINI_API_KEY;

// Endpoint para el chat de Gemini
app.post('/api/chat', async (req, res) => {
    //...
});

// Endpoint para generar imágenes
app.post('/api/generate-image', async (req, res) => {
    //...
});

// Exporta la aplicación Express para Vercel
export default app;