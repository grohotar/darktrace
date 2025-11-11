// dashboard.js - Логика для личного кабинета (Экран 3)

document.addEventListener('DOMContentLoaded', function() {
    // Проверка авторизации
    if (!sessionStorage.getItem('authenticated')) {
        window.location.href = 'login.html';
        return;
    }
    
    // Инициализация состояния игры
    const gameState = initGameState();
    
    // Навигация
    setupNavigation();
    
    // Вкладки в аудио-архиве
    setupTabs();
    
    // Материалы дела
    setupMaterials();
    
    // Голосовые сообщения
    setupVoiceMessages();
    
    // Аттестация
    setupAttestation();
    
    // Мобильное меню
    setupMobileMenu();
    
    // Выход
    setupLogout();
});

// Инициализация состояния игры
function initGameState() {
    const savedState = localStorage.getItem('gameState');
    if (savedState) {
        return JSON.parse(savedState);
    }
    
    const initialState = {
        testsCompleted: {
            test1: false,
            test2: false,
            test3: false
        },
        materialsUnlocked: {
            start: true,
            k1: false,
            k2: false,
            k3: false
        },
        locationsSelected: [],
        voiceCodesUnlocked: [],
        finalReportSubmitted: false
    };
    
    saveGameState(initialState);
    return initialState;
}

function saveGameState(state) {
    localStorage.setItem('gameState', JSON.stringify(state));
}

// Навигация между разделами
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.content-section');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetSection = this.dataset.section;
            
            // Убираем активный класс со всех пунктов
            navItems.forEach(nav => nav.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));
            
            // Добавляем активный класс
            this.classList.add('active');
            document.getElementById(targetSection).classList.add('active');
        });
    });
}

// Вкладки
function setupTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetTab = this.dataset.tab;
            
            // Убираем активный класс
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Добавляем активный класс
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
}

// Материалы дела
function setupMaterials() {
    const filterSelect = document.getElementById('filterStage');
    const materialsGrid = document.getElementById('materialsGrid');
    
    if (filterSelect) {
        filterSelect.addEventListener('change', function() {
            const selectedStage = this.value;
            const materials = materialsGrid.querySelectorAll('.material-card');
            
            materials.forEach(material => {
                const materialStage = material.dataset.stage;
                
                if (selectedStage === 'all' || selectedStage === materialStage) {
                    material.style.display = 'block';
                } else {
                    material.style.display = 'none';
                }
            });
        });
    }
    
    // Обработка открытия материалов
    const materialCards = document.querySelectorAll('.material-card');
    materialCards.forEach(card => {
        const openBtn = card.querySelector('.btn');
        if (openBtn) {
            openBtn.addEventListener('click', function() {
                // Убираем бейдж "новое"
                const badge = card.querySelector('.badge-new');
                if (badge) {
                    badge.textContent = 'просмотрено';
                    badge.classList.remove('badge-new');
                    badge.style.backgroundColor = 'var(--color-bg-tertiary)';
                }
                
                // Здесь можно открыть модальное окно с содержимым материала
                showNotification('Материал открыт', 'Содержимое материала загружается...');
            });
        }
    });
}

// Голосовые сообщения
function setupVoiceMessages() {
    const voiceCodeInput = document.getElementById('voiceCode');
    const unlockVoiceBtn = document.getElementById('unlockVoiceBtn');
    const voiceError = document.getElementById('voiceError');
    const voiceList = document.getElementById('voiceList');
    
    // Коды для голосовых сообщений (в реальном проекте на сервере)
    const validCodes = {
        '123456': 'Сообщение от Веспер #1',
        '789012': 'Сообщение от информатора',
        '345678': 'Запись с места преступления',
        '901234': 'Разговор свидетелей'
    };
    
    const gameState = initGameState();
    
    unlockVoiceBtn.addEventListener('click', function() {
        const code = voiceCodeInput.value.trim();
        
        if (validCodes[code]) {
            // Код верный
            voiceError.classList.add('hidden');
            
            // Проверяем, не был ли код уже использован
            if (!gameState.voiceCodesUnlocked.includes(code)) {
                gameState.voiceCodesUnlocked.push(code);
                saveGameState(gameState);
                
                // Добавляем сообщение в список
                addVoiceToList(validCodes[code], code);
                
                showNotification('Код принят', 'Голосовое сообщение разблокировано');
            } else {
                showNotification('Внимание', 'Это сообщение уже было прослушано');
            }
            
            voiceCodeInput.value = '';
        } else {
            // Код неверный
            voiceError.classList.remove('hidden');
            voiceCodeInput.value = '';
            
            setTimeout(() => {
                voiceError.classList.add('hidden');
            }, 3000);
        }
    });
    
    // Загрузка уже разблокированных сообщений
    gameState.voiceCodesUnlocked.forEach(code => {
        if (validCodes[code]) {
            addVoiceToList(validCodes[code], code);
        }
    });
}

function addVoiceToList(title, code) {
    const voiceList = document.getElementById('voiceList');
    const emptyText = voiceList.querySelector('.empty-text');
    
    if (emptyText) {
        emptyText.remove();
    }
    
    const voiceItem = document.createElement('div');
    voiceItem.className = 'voice-item';
    voiceItem.style.cssText = `
        background-color: var(--color-bg-tertiary);
        padding: var(--spacing-md);
        margin-bottom: var(--spacing-sm);
        border: 1px solid var(--color-border);
        display: flex;
        justify-content: space-between;
        align-items: center;
    `;
    voiceItem.innerHTML = `
        <div>
            <h5 style="margin-bottom: 0.5rem;">${title}</h5>
            <p style="font-size: 0.875rem; color: var(--color-text-muted);">Код: ${code}</p>
        </div>
        <button class="btn btn-secondary btn-sm play-voice">▶ Прослушать</button>
    `;
    
    const playBtn = voiceItem.querySelector('.play-voice');
    playBtn.addEventListener('click', function() {
        showNotification('Воспроизведение', `Воспроизводится: ${title}`);
    });
    
    voiceList.appendChild(voiceItem);
}

// Аттестация
function setupAttestation() {
    const gameState = initGameState();
    
    // Тесты
    const startTest1 = document.getElementById('startTest1');
    if (startTest1) {
        startTest1.addEventListener('click', function() {
            // Здесь должна быть логика теста
            // Для демонстрации просто помечаем тест как пройденный
            showNotification('Тест №1', 'Запуск теста...');
            
            // Симуляция прохождения теста
            setTimeout(() => {
                completeTest(1);
            }, 2000);
        });
    }
    
    // Выбор локаций
    const locationCards = document.querySelectorAll('.location-card');
    const confirmLocationsBtn = document.getElementById('confirmLocations');
    let selectedLocations = [];
    
    locationCards.forEach(card => {
        const checkbox = card.querySelector('.location-checkbox');
        
        card.addEventListener('click', function(e) {
            if (e.target !== checkbox) {
                checkbox.checked = !checkbox.checked;
            }
            
            const location = this.dataset.location;
            
            if (checkbox.checked) {
                if (selectedLocations.length < 2) {
                    selectedLocations.push(location);
                    this.style.borderColor = 'var(--color-accent-red)';
                } else {
                    checkbox.checked = false;
                    showNotification('Ограничение', 'Можно выбрать только две локации');
                }
            } else {
                selectedLocations = selectedLocations.filter(l => l !== location);
                this.style.borderColor = 'var(--color-border)';
            }
            
            // Активируем кнопку подтверждения если выбрано 2 локации
            if (selectedLocations.length === 2) {
                confirmLocationsBtn.disabled = false;
            } else {
                confirmLocationsBtn.disabled = true;
            }
        });
    });
    
    if (confirmLocationsBtn) {
        confirmLocationsBtn.addEventListener('click', function() {
            gameState.locationsSelected = selectedLocations;
            saveGameState(gameState);
            
            showNotification('Выбор подтвержден', 
                `Санкция выдана на осмотр: ${selectedLocations.length} локаций`);
            
            // Блокируем невыбранные локации
            locationCards.forEach(card => {
                const location = card.dataset.location;
                if (!selectedLocations.includes(location)) {
                    card.style.opacity = '0.3';
                    card.style.pointerEvents = 'none';
                }
            });
            
            this.disabled = true;
            this.textContent = 'Выбор сохранен';
        });
    }
    
    // Финальный отчет
    const submitReportBtn = document.getElementById('submitReportBtn');
    if (submitReportBtn) {
        submitReportBtn.addEventListener('click', function() {
            // Здесь должна быть форма финального отчета
            // Для демонстрации переходим на страницу эпилога
            const confirmed = confirm('Вы уверены? Это действие необратимо.');
            
            if (confirmed) {
                // В реальном проекте здесь проверка ответов
                const isCorrect = Math.random() > 0.5; // Случайный результат для демо
                
                if (isCorrect) {
                    window.location.href = 'epilogue-victory.html';
                } else {
                    window.location.href = 'epilogue-failure.html';
                }
            }
        });
    }
}

function completeTest(testNumber) {
    const gameState = initGameState();
    
    gameState.testsCompleted[`test${testNumber}`] = true;
    
    // Разблокируем материалы
    if (testNumber === 1) {
        gameState.materialsUnlocked.k1 = true;
        showNotification('Тест №1 пройден!', 'Материалы Конверта №1 разблокированы');
        addMaterialsNotification();
        unlockTest(2);
    } else if (testNumber === 2) {
        gameState.materialsUnlocked.k2 = true;
        showNotification('Тест №2 пройден!', 'Материалы Конверта №2 разблокированы');
        showLocationSelection();
        addMaterialsNotification();
        unlockTest(3);
    } else if (testNumber === 3) {
        gameState.materialsUnlocked.k3 = true;
        showNotification('Тест №3 пройден!', 'Материалы Конверта №3 разблокированы');
        showFinalReport();
        addMaterialsNotification();
    }
    
    saveGameState(gameState);
}

function unlockTest(testNumber) {
    const testCard = document.querySelector(`[data-test="${testNumber}"]`);
    if (testCard) {
        testCard.classList.remove('locked');
        const button = testCard.querySelector('button');
        button.disabled = false;
        button.classList.remove('btn-secondary');
        button.classList.add('btn-primary');
        button.textContent = 'Начать тест';
        
        const status = document.getElementById(`test${testNumber}Status`);
        if (status) {
            status.textContent = 'Доступен';
            status.classList.remove('badge-locked');
        }
    }
}

function showLocationSelection() {
    const locationSelection = document.getElementById('locationSelection');
    if (locationSelection) {
        locationSelection.classList.remove('hidden');
    }
}

function showFinalReport() {
    const finalReport = document.getElementById('finalReport');
    if (finalReport) {
        finalReport.classList.remove('hidden');
    }
}

function addMaterialsNotification() {
    const materialsNotif = document.getElementById('materialsNotif');
    if (materialsNotif) {
        materialsNotif.classList.remove('hidden');
    }
}

// Мобильное меню
function setupMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('mobile-hidden');
        });
    }
}

// Выход
function setupLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    
    logoutBtn.addEventListener('click', function() {
        const confirmed = confirm('Вы уверены, что хотите выйти?');
        
        if (confirmed) {
            sessionStorage.removeItem('authenticated');
            window.location.href = 'login.html';
        }
    });
}

// Модальное окно уведомлений
function showNotification(title, message) {
    const modal = document.getElementById('notificationModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalText = document.getElementById('modalText');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    
    modalTitle.textContent = title;
    modalText.textContent = message;
    
    modal.classList.remove('hidden');
    
    modalCloseBtn.onclick = function() {
        modal.classList.add('hidden');
    };
    
    modal.onclick = function(e) {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    };
}

