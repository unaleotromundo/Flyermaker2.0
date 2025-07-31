// File: api/index.js

const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Configuración de la API de Gemini (la clave la proporciona Vercel)
const GEMINI_API_URL_TEXT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent';
const GEMINI_API_URL_IMAGE = 'https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict';

// Endpoint para generar texto
app.post('/api/generate-text', async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({ error: 'El prompt es requerido.' });
        }

        const apiKey = process.env.GEMINI_API_KEY || ''; // Obtener la clave de Vercel
        if (!apiKey) {
            return res.status(500).json({ error: 'La clave de API no está configurada.' });
        }

        const payload = {
            contents: [{ parts: [{ text: prompt }] }]
        };

        const response = await fetch(`${GEMINI_API_URL_TEXT}?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const result = await response.json();
        res.status(response.status).json(result);
    } catch (error) {
        console.error('Error en el endpoint de generación de texto:', error);
        res.status(500).json({ error: 'Error interno del servidor al procesar la solicitud.' });
    }
});

// Endpoint para generar imagen
app.post('/api/generate-image', async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({ error: 'El prompt es requerido.' });
        }

        const apiKey = process.env.GEMINI_API_KEY || '';
        if (!apiKey) {
            return res.status(500).json({ error: 'La clave de API no está configurada.' });
        }

        const payload = {
            instances: { prompt: prompt },
            parameters: { "sampleCount": 1 }
        };

        const response = await fetch(`${GEMINI_API_URL_IMAGE}?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const result = await response.json();
        res.status(response.status).json(result);
    } catch (error) {
        console.error('Error en el endpoint de generación de imagen:', error);
        res.status(500).json({ error: 'Error interno del servidor al procesar la solicitud.' });
    }
});

// Exportar la aplicación para Vercel
module.exports = app;
