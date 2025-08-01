document.addEventListener('DOMContentLoaded', () => {
    // Escuchar clics en los botones principales
    const tiendaBtn = document.querySelector('.btn-tienda');
    const catalogoBtn = document.querySelector('.btn-catalogo');
    
    tiendaBtn.addEventListener('click', () => {
        window.location.href = 'crear_tienda.html'; 
    });
    
    catalogoBtn.addEventListener('click', () => {
        window.location.href = 'crear_catalogo.html';
    });

    // Lógica para el chat con IA
    const aiChatIcon = document.querySelector('.ai-chat-icon');
    const chatModal = document.getElementById('ai-chat-modal');
    const closeChatBtn = document.getElementById('close-chat-btn');
    const chatBody = document.getElementById('chat-body');
    const chatInput = document.getElementById('chat-input');
    const sendChatBtn = document.getElementById('send-chat-btn');

    // Muestra/oculta el chat
    aiChatIcon.addEventListener('click', () => {
        chatModal.classList.toggle('visible');
    });

    closeChatBtn.addEventListener('click', () => {
        chatModal.classList.remove('visible');
    });

    // Envía el mensaje (simulación)
    const sendMessage = () => {
        const userMessage = chatInput.value.trim();
        if (userMessage) {
            // Muestra el mensaje del usuario
            chatBody.innerHTML += `<div class="user-message">${userMessage}</div>`;
            chatInput.value = '';
            chatBody.scrollTop = chatBody.scrollHeight; // Auto-scroll
            
            // Simulación de respuesta de la IA
            // AQUÍ es donde conectarías tu API de Gemini
            setTimeout(() => {
                chatBody.innerHTML += `<div class="ai-message">Entiendo. ¿Qué más puedo hacer por ti?</div>`;
                chatBody.scrollTop = chatBody.scrollHeight;
            }, 1000);
        }
    };

    sendChatBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});