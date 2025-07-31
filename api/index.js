// File: api/index.js

const express = require('express');
const cors = require('cors'); // Middleware para habilitar CORS
const fetch = require('node-fetch'); // Para hacer peticiones HTTP en Node.js

const app = express();
app.use(express.json());
app.use(cors()); // Habilitar CORS para todas las rutas

const PORT = process.env.PORT || 3000;

// Configuración de la API de Gemini (deja la clave vacía, Vercel la proporcionará)
const GEMINI_API_KEY = "";
const GEMINI_API_URL_TEXT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${GEMINI_API_KEY}`;
const GEMINI_API_URL_IMAGE = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${GEMINI_API_KEY}`;

// Función para manejar las reintentos con backoff exponencial
async function fetchWithBackoff(url, options) {
    let delay = 1000;
    for (let i = 0; i < 5; i++) { // 5 reintentos
        try {
            const response = await fetch(url, options);
            if (response.ok) {
                return response;
            } else if (response.status === 429) { // Límite de cuota
                console.warn(`API rate limit exceeded. Retrying in ${delay / 1000}s...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                delay *= 2; // Duplicar el tiempo de espera
            } else {
                return response;
            }
        } catch (error) {
            console.error(`Error fetching from API: ${error.message}. Retrying in ${delay / 1000}s...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            delay *= 2;
        }
    }
    throw new Error('Maximum retries exceeded.');
}

// Endpoint para generar texto
app.post('/api/generate-text', async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({ error: 'El prompt es requerido.' });
        }

        const payload = {
            contents: [{ parts: [{ text: prompt }] }]
        };

        const response = await fetchWithBackoff(GEMINI_API_URL_TEXT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const result = await response.json();
        res.status(response.status).json(result);
    } catch (error) {
        console.error('Error en el endpoint de generación de texto:', error);
        res.status(500).json({ error: error.message });
    }
});

// Endpoint para generar imagen
app.post('/api/generate-image', async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({ error: 'El prompt es requerido.' });
        }

        const payload = {
            instances: { prompt: prompt },
            parameters: { "sampleCount": 1 }
        };

        const response = await fetchWithBackoff(GEMINI_API_URL_IMAGE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const result = await response.json();
        res.status(response.status).json(result);
    } catch (error) {
        console.error('Error en el endpoint de generación de imagen:', error);
        res.status(500).json({ error: error.message });
    }
});

// Mensaje de bienvenida para la ruta raíz
app.get('/', (req, res) => {
    res.status(200).send('Servidor backend para el creador de catálogos está activo.');
});

// Exportar la aplicación para Vercel
module.exports = app;

