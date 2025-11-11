// login.js - Логика для страницы входа (Экран 2)

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('errorMessage');
    
    // Учетные данные (в реальном проекте это должно быть на сервере)
    const CORRECT_USERNAME = 'agent';
    const CORRECT_PASSWORD = 'darktrace2025';
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = usernameInput.value.trim();
        const password = passwordInput.value;
        
        // Проверка учетных данных
        if (username === CORRECT_USERNAME && password === CORRECT_PASSWORD) {
            // Успешный вход
            errorMessage.classList.add('hidden');
            
            // Сохраняем состояние авторизации
            sessionStorage.setItem('authenticated', 'true');
            
            // Анимация успеха
            loginForm.style.opacity = '0.5';
            
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 500);
        } else {
            // Ошибка входа
            errorMessage.classList.remove('hidden');
            
            // Тряска формы
            loginForm.style.animation = 'shake 0.5s';
            setTimeout(() => {
                loginForm.style.animation = '';
            }, 500);
            
            // Очистка полей
            passwordInput.value = '';
            usernameInput.focus();
        }
    });
    
    // Скрытие ошибки при вводе
    [usernameInput, passwordInput].forEach(input => {
        input.addEventListener('input', () => {
            errorMessage.classList.add('hidden');
        });
    });
});

// CSS анимация тряски (добавляется динамически)
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
`;
document.head.appendChild(style);

