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
    
    // Показываем экран звонка при загрузке
    videoFallback.classList.remove('hidden');
    initialButtons.classList.add('hidden');
    
    // Включение звука
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
    
    // Кнопка "Начать звонок" - запускает видео и показывает кнопки
    if (startCallBtn) {
        startCallBtn.addEventListener('click', async () => {
            videoFallback.classList.add('hidden');
            initialButtons.classList.remove('hidden');
            
            try {
                await video.play();
                enableSound();
            } catch (error) {
                console.log('Не удалось запустить видео с автоплеем');
                // Видео запустится без звука, пользователь может включить звук кликом
            }
        });
    }
    
    // Слушатель для включения звука при клике на видео
    videoContainer.addEventListener('click', enableSound, { once: true });
    
    // Кнопка "ДА, принимаю дело" - сразу переход на логин
    acceptBtn.addEventListener('click', () => {
        window.location.href = 'login.html';
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
    
    // Обработка ошибок загрузки видео
    video.addEventListener('error', () => {
        console.log('Ошибка загрузки видео, показываем фолбэк');
        videoFallback.classList.remove('hidden');
    });
});

