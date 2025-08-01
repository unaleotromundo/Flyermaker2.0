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

        const apiKey = process.env.GEMINI_API_KEY || '';
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

// Endpoint para generar imagen - CORREGIDO
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

        // Verificamos si la llamada a la API fue exitosa
        if (!response.ok) {
            // Si hay un error, lo enviamos al cliente para que sepa qué pasó
            const errorResult = await response.json();
            return res.status(response.status).json(errorResult);
        }

        const result = await response.json();
        
        // 1. Extraemos los datos Base64 de la imagen de la respuesta anidada
        const base64Data = result?.predictions?.[0]?.bytesBase64Encoded;

        // 2. Si los datos existen, construimos una URL de imagen y la enviamos al cliente
        if (base64Data) {
            const imageUrl = `data:image/png;base64,${base64Data}`;
            // Enviamos un objeto JSON simple con la URL de la imagen
            res.status(200).json({ imageUrl: imageUrl });
        } else {
            // Si la respuesta no contiene la imagen, enviamos un error claro
            console.error('La respuesta de la API de Imagen no contiene datos de imagen esperados.');
            res.status(500).json({ error: 'No se pudo generar la imagen. La respuesta de la API fue inesperada.' });
        }

    } catch (error) {
        console.error('Error en el endpoint de generación de imagen:', error);
        res.status(500).json({ error: 'Error interno del servidor al procesar la solicitud.' });
    }
});

// Exportar la aplicación para Vercel
module.exports = app;
