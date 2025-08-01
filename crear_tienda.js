document.addEventListener('DOMContentLoaded', () => {
    const storeForm = document.getElementById('store-form');
    const sloganInput = document.getElementById('store-slogan');
    const logoUploadArea = document.getElementById('logo-upload');
    const bannerUploadArea = document.getElementById('banner-upload');
    const generateQrBtn = document.getElementById('generate-qr-btn');
    const qrCodeDiv = document.getElementById('qr-code');

    // Manejar la subida y previsualización de imágenes
    const handleImageUpload = (input, area) => {
        const file = input.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                area.style.backgroundImage = `url(${e.target.result})`;
                area.style.backgroundSize = 'cover';
                area.style.backgroundPosition = 'center';
                area.innerHTML = ''; // Limpiar el icono de cámara
            };
            reader.readAsDataURL(file);
        }
    };

    logoUploadArea.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.addEventListener('change', () => handleImageUpload(input, logoUploadArea));
        input.click();
    });

    bannerUploadArea.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.addEventListener('change', () => handleImageUpload(input, bannerUploadArea));
        input.click();
    });

    // Placeholder para la generación de contenido con IA
    const handleAIButtonClick = (targetElement, action) => {
        targetElement.textContent = 'Generando...';
        // Aquí iría la lógica para llamar a tu API de Gemini
        // Por ahora, usamos un temporizador para simular la respuesta
        setTimeout(() => {
            if (action === 'slogan') {
                targetElement.value = 'Tu Eslogan Generado por IA';
            } else if (action === 'logo') {
                logoUploadArea.style.backgroundImage = `url('https://via.placeholder.com/150x150.png?text=Logo+IA')`;
                logoUploadArea.style.backgroundSize = 'cover';
                logoUploadArea.innerHTML = '';
            }
        }, 1500);
    };

    document.querySelectorAll('.ai-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const container = e.target.closest('.slogan-container') || e.target.closest('.image-box');
            if (container.querySelector('input')) {
                handleAIButtonClick(container.querySelector('input'), 'slogan');
            } else if (container.querySelector('#logo-upload')) {
                handleAIButtonClick(container.querySelector('#logo-upload'), 'logo');
            } else if (container.querySelector('#banner-upload')) {
                // Lógica para banner IA
            }
        });
    });

    // Generar Código QR (usando una API o librería externa)
    generateQrBtn.addEventListener('click', () => {
        const websiteUrl = document.getElementById('store-website').value;
        if (websiteUrl) {
            // En un proyecto real, usarías una librería como 'qrcode.js'
            // Por ahora, creamos una imagen placeholder
            qrCodeDiv.innerHTML = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(websiteUrl)}" alt="Código QR">`;
        } else {
            alert('Por favor, ingresa una dirección de página web para generar el QR.');
        }
    });

    // Manejar el envío del formulario
    storeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const storeData = new FormData(storeForm);
        // Aquí se recogería toda la información del formulario
        // y se guardaría para usarla en la creación del catálogo.
        
        console.log('Datos de la tienda guardados:', storeData);
        alert('¡Tienda guardada con éxito! Ahora puedes crear tu catálogo.');
        // Redirigir a la página de creación de catálogo
        // window.location.href = 'crear_catalogo.html'; 
    });
});