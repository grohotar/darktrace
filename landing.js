// landing.js - Логика для лендинга (Экран 1)

document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('mainVideo');
    const videoContainer = document.getElementById('videoContainer');
    const initialButtons = document.getElementById('initialButtons');
    const rejectMessage = document.getElementById('rejectMessage');
    const loginRedirect = document.getElementById('loginRedirect');
    const soundIndicator = document.getElementById('soundIndicator');
    const videoFallback = document.getElementById('videoFallback');
    
    const acceptBtn = document.getElementById('acceptBtn');
    const rejectBtn = document.getElementById('rejectBtn');
    const returnBtn = document.getElementById('returnBtn');
    const enterBtn = document.getElementById('enterBtn');
    const startCallBtn = document.getElementById('startCallBtn');
    
    let soundEnabled = false;
    
    // Попытка автоплея видео
    const playVideo = async () => {
        try {
            await video.play();
            videoFallback.classList.add('hidden');
        } catch (error) {
            console.log('Автоплей не удался, показываем фолбэк');
            videoFallback.classList.remove('hidden');
        }
    };
    
    // Запускаем видео при загрузке
    playVideo();
    
    // Включение звука при первом клике
    const enableSound = () => {
        if (!soundEnabled) {
            video.muted = false;
            soundEnabled = true;
            soundIndicator.innerHTML = '<span class="sound-icon">🔊</span><span class="sound-text">Звук включен</span>';
            setTimeout(() => {
                soundIndicator.classList.add('hidden');
            }, 2000);
        }
    };
    
    // Слушатель для включения звука
    videoContainer.addEventListener('click', enableSound, { once: true });
    
    // Кнопка "Начать звонок" (фолбэк)
    if (startCallBtn) {
        startCallBtn.addEventListener('click', async () => {
            videoFallback.classList.add('hidden');
            await video.play();
            enableSound();
        });
    }
    
    // Кнопка "ДА, принимаю дело"
    acceptBtn.addEventListener('click', () => {
        initialButtons.classList.add('hidden');
        loginRedirect.classList.remove('hidden');
    });
    
    // Кнопка "НЕТ"
    rejectBtn.addEventListener('click', () => {
        initialButtons.classList.add('hidden');
        rejectMessage.classList.remove('hidden');
    });
    
    // Кнопка "Вернуться"
    returnBtn.addEventListener('click', () => {
        rejectMessage.classList.add('hidden');
        initialButtons.classList.remove('hidden');
    });
    
    // Кнопка "ВОЙТИ"
    enterBtn.addEventListener('click', () => {
        window.location.href = 'login.html';
    });
    
    // Обработка ошибок загрузки видео
    video.addEventListener('error', () => {
        console.log('Ошибка загрузки видео, показываем фолбэк');
        videoFallback.classList.remove('hidden');
    });
});

