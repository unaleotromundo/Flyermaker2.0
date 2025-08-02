document.addEventListener('DOMContentLoaded', () => {
const imagePromptInput = document.getElementById('imagePrompt');
const generateImageBtn = document.getElementById('generateImageBtn');
const magicPromptBtn = document.getElementById('magicPromptBtn');
const imageResultDiv = document.getElementById('imageResult');
const promptResultDiv = document.getElementById('promptResult');

generateImageBtn.addEventListener('click', async () => {
    const prompt = imagePromptInput.value;
    if (prompt) {
        const response = await fetch('/api/generate-image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt }),
        });

        const data = await response.json();
        if (data?.imageUrl) {
            imageResultDiv.innerHTML = `<img src="${data.imageUrl}" alt="Imagen generada">`;
        } else {
            imageResultDiv.innerHTML = `<p>Error al generar la imagen: ${data?.error || 'Inténtalo de nuevo.'}</p>`;
        }
    } else {
        alert('Por favor, escribe un prompt para la imagen.');
    }
});

magicPromptBtn.addEventListener('click', async () => {
    const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: 'Genera un prompt creativo y divertido para la creación de una imagen.' }),
    });

    const data = await response.json();
    if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        imagePromptInput.value = data.candidates?.[0]?.content?.parts?.[0]?.text;
        promptResultDiv.textContent = `Prompt generado: ${imagePromptInput.value}`;
    } else {
        promptResultDiv.textContent = 'Error al generar el prompt.';
    }
});
});