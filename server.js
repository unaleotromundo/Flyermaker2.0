require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const openai = new OpenAI({ apiKey: process.env.IMAGEN_API_KEY });

app.post('/api/generar-imagen', async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt,
      n: 1,
      size: '1024x1024'
    });

    const imageUrl = response.data[0].url;
    res.json({ imageUrl });
  } catch (error) {
    console.error('Error al generar imagen:', error.message);
    res.status(500).json({ error: 'Error al generar imagen con OpenAI' });
  }
});

app.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));
