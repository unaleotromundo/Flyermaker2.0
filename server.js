// Endpoint para generar imágenes (logo) - Corregido
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

        // Verificamos si la respuesta de la API fue exitosa
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error de la API de Imagen:', response.status, errorText);
            // Si la respuesta no fue JSON, enviamos el error como texto.
            return res.status(response.status).json({ error: `Error de la API: ${errorText}` });
        }

        const result = await response.json();

        // 1. Extraemos los datos de la imagen codificados en Base64 de la respuesta
        const base64Data = result?.predictions?.[0]?.bytesBase64Encoded;

        // 2. Si se encuentra la imagen, la enviamos al cliente en un formato útil
        if (base64Data) {
            // El cliente recibirá un JSON con la propiedad `imageUrl`
            res.json({ imageUrl: `data:image/png;base64,${base64Data}` });
        } else {
            // Manejamos el caso en que la respuesta no contiene la imagen
            console.error('La respuesta de la API no contiene datos de imagen esperados.');
            res.status(500).json({ error: 'No se pudo generar el logo. Inténtelo de nuevo.' });
        }

    } catch (error) {
        console.error('Error al llamar a la API de Imagen:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});