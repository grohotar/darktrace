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
    
    // Досье фигурантов
    setupDossiers();
    
    // Голосовые сообщения
    setupVoiceMessages();
    
    // Интерактивная карта
    setupMap();
    
    // Финальный отчет
    setupFinalReport();
    
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
    const sidebar = document.getElementById('sidebar');
    
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
            
            // Закрываем мобильное меню
            if (window.innerWidth <= 768 && sidebar) {
                sidebar.classList.remove('mobile-visible');
                const overlay = document.getElementById('mobileOverlay');
                if (overlay) {
                    overlay.classList.remove('active');
                }
            }
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

// Досье фигурантов
function setupDossiers() {
    const dossierCards = document.querySelectorAll('.dossier-card');
    
    dossierCards.forEach(card => {
        const viewBtn = card.querySelector('.view-dossier');
        const character = card.dataset.character;
        
        if (viewBtn) {
            viewBtn.addEventListener('click', function() {
                const characterName = card.querySelector('.dossier-name').textContent;
                
                // Для Селены и Аларика показываем кнопку перехода к перехваченным данным
                if (character === 'selina' || character === 'alaric') {
                    showNotification(
                        `Досье: ${characterName}`,
                        'Досье открыто. Обнаружена кнопка [ПРОСМОТРЕТЬ КАНАЛ] для доступа к перехваченным данным.'
                    );
                } else {
                    showNotification(
                        `Досье: ${characterName}`,
                        'Полное досье персонажа загружается...'
                    );
                }
            });
        }
    });
    
    // Обработка кнопок "Показать расшифровку" для видео
    const transcriptBtns = document.querySelectorAll('.show-transcript');
    transcriptBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const videoCard = this.closest('.video-card');
            const videoTitle = videoCard.querySelector('.video-title').textContent;
            showNotification('Расшифровка', `Расшифровка для "${videoTitle}" загружается...`);
        });
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

// Интерактивная карта
function setupMap() {
    const calculateRouteBtn = document.getElementById('calculateRouteBtn');
    const routeCalculator = document.getElementById('routeCalculator');
    const calculateBtn = document.getElementById('calculateBtn');
    const routeStart = document.getElementById('routeStart');
    const routeEnd = document.getElementById('routeEnd');
    const routeResult = document.getElementById('routeResult');
    const routeTime = document.getElementById('routeTime');
    const timeFilter = document.getElementById('timeFilter');
    const mapMarkers = document.querySelectorAll('.map-marker');
    
    let selectedMarkers = [];
    
    // Данные о времени в пути между всеми локациями (зашиты в коде)
    const routeTimes = {
        // 1. Студия Селены Блэк - все маршруты
        'selena-studio_arthur-house': { car: '2 мин', walk: '8 мин' },
        'selena-studio_dreamers-cafe': { car: '7 мин', walk: '20 мин' },
        'selena-studio_alaric-attic': { car: '10 мин', walk: '28 мин' },
        'selena-studio_vesper-studio': { car: '12 мин', walk: '35 мин' },
        'selena-studio_pharmacy': { car: '8 мин', walk: '22 мин' },
        'selena-studio_selena-apartment': { car: '9 мин', walk: '25 мин' },
        'selena-studio_bank': { car: '14 мин', walk: '40 мин' },
        'selena-studio_gulf-station': { car: '22 мин', walk: '65 мин' },
        'selena-studio_onyx-restaurant': { car: '16 мин', walk: '48 мин' },
        'selena-studio_underwood-mansion': { car: '18 мин', walk: '52 мин' },
        'selena-studio_artmodern-gallery': { car: '15 мин', walk: '45 мин' },
        'selena-studio_marcus-apartment': { car: '17 мин', walk: '50 мин' },
        'selena-studio_doctor-office': { car: '19 мин', walk: '55 мин' },
        'selena-studio_vault-gallery': { car: '10 мин', walk: '30 мин' },
        'selena-studio_darktrace-office': { car: '20 мин', walk: '58 мин' },
        'selena-studio_police-department': { car: '18 мин', walk: '52 мин' },
        
        // 2. Дом Артура Пейна - все маршруты
        'arthur-house_dreamers-cafe': { car: '8 мин', walk: '22 мин' },
        'arthur-house_alaric-attic': { car: '11 мин', walk: '32 мин' },
        'arthur-house_vesper-studio': { car: '13 мин', walk: '38 мин' },
        'arthur-house_pharmacy': { car: '9 мин', walk: '25 мин' },
        'arthur-house_selena-apartment': { car: '10 мин', walk: '28 мин' },
        'arthur-house_bank': { car: '15 мин', walk: '43 мин' },
        'arthur-house_gulf-station': { car: '23 мин', walk: '68 мин' },
        'arthur-house_onyx-restaurant': { car: '17 мин', walk: '50 мин' },
        'arthur-house_underwood-mansion': { car: '19 мин', walk: '55 мин' },
        'arthur-house_artmodern-gallery': { car: '16 мин', walk: '47 мин' },
        'arthur-house_marcus-apartment': { car: '18 мин', walk: '52 мин' },
        'arthur-house_doctor-office': { car: '20 мин', walk: '58 мин' },
        'arthur-house_vault-gallery': { car: '11 мин', walk: '32 мин' },
        'arthur-house_darktrace-office': { car: '21 мин', walk: '60 мин' },
        'arthur-house_police-department': { car: '19 мин', walk: '55 мин' },
        
        // 3. Кофейня Мечтатели - все маршруты
        'dreamers-cafe_alaric-attic': { car: '5 мин', walk: '15 мин' },
        'dreamers-cafe_vesper-studio': { car: '8 мин', walk: '22 мин' },
        'dreamers-cafe_pharmacy': { car: '4 мин', walk: '12 мин' },
        'dreamers-cafe_selena-apartment': { car: '6 мин', walk: '18 мин' },
        'dreamers-cafe_bank': { car: '12 мин', walk: '35 мин' },
        'dreamers-cafe_gulf-station': { car: '20 мин', walk: '58 мин' },
        'dreamers-cafe_onyx-restaurant': { car: '13 мин', walk: '38 мин' },
        'dreamers-cafe_underwood-mansion': { car: '16 мин', walk: '47 мин' },
        'dreamers-cafe_artmodern-gallery': { car: '13 мин', walk: '38 мин' },
        'dreamers-cafe_marcus-apartment': { car: '14 мин', walk: '40 мин' },
        'dreamers-cafe_doctor-office': { car: '16 мин', walk: '47 мин' },
        'dreamers-cafe_vault-gallery': { car: '7 мин', walk: '20 мин' },
        'dreamers-cafe_darktrace-office': { car: '18 мин', walk: '52 мин' },
        'dreamers-cafe_police-department': { car: '15 мин', walk: '45 мин' },
        
        // 4. Мансарда Аларика - все маршруты
        'alaric-attic_vesper-studio': { car: '4 мин', walk: '12 мин' },
        'alaric-attic_pharmacy': { car: '2 мин', walk: '6 мин' },
        'alaric-attic_selena-apartment': { car: '8 мин', walk: '22 мин' },
        'alaric-attic_bank': { car: '13 мин', walk: '38 мин' },
        'alaric-attic_gulf-station': { car: '21 мин', walk: '60 мин' },
        'alaric-attic_onyx-restaurant': { car: '10 мин', walk: '28 мин' },
        'alaric-attic_underwood-mansion': { car: '17 мин', walk: '50 мин' },
        'alaric-attic_artmodern-gallery': { car: '14 мин', walk: '40 мин' },
        'alaric-attic_marcus-apartment': { car: '11 мин', walk: '32 мин' },
        'alaric-attic_doctor-office': { car: '16 мин', walk: '47 мин' },
        'alaric-attic_vault-gallery': { car: '9 мин', walk: '25 мин' },
        'alaric-attic_darktrace-office': { car: '19 мин', walk: '55 мин' },
        'alaric-attic_police-department': { car: '15 мин', walk: '45 мин' },
        
        // 5. Фотостудия Веспер - все маршруты
        'vesper-studio_pharmacy': { car: '5 мин', walk: '15 мин' },
        'vesper-studio_selena-apartment': { car: '11 мин', walk: '32 мин' },
        'vesper-studio_bank': { car: '14 мин', walk: '40 мин' },
        'vesper-studio_gulf-station': { car: '22 мин', walk: '65 мин' },
        'vesper-studio_onyx-restaurant': { car: '8 мин', walk: '22 мин' },
        'vesper-studio_underwood-mansion': { car: '18 мин', walk: '52 мин' },
        'vesper-studio_artmodern-gallery': { car: '15 мин', walk: '45 мин' },
        'vesper-studio_marcus-apartment': { car: '9 мин', walk: '25 мин' },
        'vesper-studio_doctor-office': { car: '17 мин', walk: '50 мин' },
        'vesper-studio_vault-gallery': { car: '12 мин', walk: '35 мин' },
        'vesper-studio_darktrace-office': { car: '20 мин', walk: '58 мин' },
        'vesper-studio_police-department': { car: '16 мин', walk: '47 мин' },
        
        // 6. Аптека - все маршруты
        'pharmacy_selena-apartment': { car: '7 мин', walk: '20 мин' },
        'pharmacy_bank': { car: '12 мин', walk: '35 мин' },
        'pharmacy_gulf-station': { car: '20 мин', walk: '58 мин' },
        'pharmacy_onyx-restaurant': { car: '11 мин', walk: '32 мин' },
        'pharmacy_underwood-mansion': { car: '16 мин', walk: '47 мин' },
        'pharmacy_artmodern-gallery': { car: '13 мин', walk: '38 мин' },
        'pharmacy_marcus-apartment': { car: '12 мин', walk: '35 мин' },
        'pharmacy_doctor-office': { car: '15 мин', walk: '45 мин' },
        'pharmacy_vault-gallery': { car: '8 мин', walk: '22 мин' },
        'pharmacy_darktrace-office': { car: '18 мин', walk: '52 мин' },
        'pharmacy_police-department': { car: '14 мин', walk: '40 мин' },
        
        // 7. Квартира Селены Блэк - все маршруты
        'selena-apartment_bank': { car: '13 мин', walk: '38 мин' },
        'selena-apartment_gulf-station': { car: '21 мин', walk: '60 мин' },
        'selena-apartment_onyx-restaurant': { car: '15 мин', walk: '45 мин' },
        'selena-apartment_underwood-mansion': { car: '17 мин', walk: '50 мин' },
        'selena-apartment_artmodern-gallery': { car: '14 мин', walk: '40 мин' },
        'selena-apartment_marcus-apartment': { car: '16 мин', walk: '47 мин' },
        'selena-apartment_doctor-office': { car: '18 мин', walk: '52 мин' },
        'selena-apartment_vault-gallery': { car: '4 мин', walk: '12 мин' },
        'selena-apartment_darktrace-office': { car: '19 мин', walk: '55 мин' },
        'selena-apartment_police-department': { car: '17 мин', walk: '50 мин' },
        
        // 8. Банк - все маршруты
        'bank_gulf-station': { car: '12 мин', walk: '35 мин' },
        'bank_onyx-restaurant': { car: '14 мин', walk: '40 мин' },
        'bank_underwood-mansion': { car: '10 мин', walk: '28 мин' },
        'bank_artmodern-gallery': { car: '5 мин', walk: '15 мин' },
        'bank_marcus-apartment': { car: '13 мин', walk: '38 мин' },
        'bank_doctor-office': { car: '8 мин', walk: '22 мин' },
        'bank_vault-gallery': { car: '16 мин', walk: '47 мин' },
        'bank_darktrace-office': { car: '14 мин', walk: '40 мин' },
        'bank_police-department': { car: '7 мин', walk: '20 мин' },
        
        // 9. Заправка Галф - все маршруты
        'gulf-station_onyx-restaurant': { car: '18 мин', walk: '52 мин' },
        'gulf-station_underwood-mansion': { car: '8 мин', walk: '22 мин' },
        'gulf-station_artmodern-gallery': { car: '14 мин', walk: '40 мин' },
        'gulf-station_marcus-apartment': { car: '19 мин', walk: '55 мин' },
        'gulf-station_doctor-office': { car: '16 мин', walk: '47 мин' },
        'gulf-station_vault-gallery': { car: '24 мин', walk: '70 мин' },
        'gulf-station_darktrace-office': { car: '9 мин', walk: '25 мин' },
        'gulf-station_police-department': { car: '15 мин', walk: '45 мин' },
        
        // 10. Ресторан Оникс - все маршруты
        'onyx-restaurant_underwood-mansion': { car: '16 мин', walk: '47 мин' },
        'onyx-restaurant_artmodern-gallery': { car: '12 мин', walk: '35 мин' },
        'onyx-restaurant_marcus-apartment': { car: '4 мин', walk: '12 мин' },
        'onyx-restaurant_doctor-office': { car: '10 мин', walk: '28 мин' },
        'onyx-restaurant_vault-gallery': { car: '18 мин', walk: '52 мин' },
        'onyx-restaurant_darktrace-office': { car: '19 мин', walk: '55 мин' },
        'onyx-restaurant_police-department': { car: '11 мин', walk: '32 мин' },
        
        // 11. Особняк Андервудов - все маршруты
        'underwood-mansion_artmodern-gallery': { car: '13 мин', walk: '38 мин' },
        'underwood-mansion_marcus-apartment': { car: '17 мин', walk: '50 мин' },
        'underwood-mansion_doctor-office': { car: '15 мин', walk: '45 мин' },
        'underwood-mansion_vault-gallery': { car: '20 мин', walk: '58 мин' },
        'underwood-mansion_darktrace-office': { car: '11 мин', walk: '32 мин' },
        'underwood-mansion_police-department': { car: '14 мин', walk: '40 мин' },
        
        // 12. Галерея Арт-Модерн - все маршруты
        'artmodern-gallery_marcus-apartment': { car: '11 мин', walk: '32 мин' },
        'artmodern-gallery_doctor-office': { car: '6 мин', walk: '18 мин' },
        'artmodern-gallery_vault-gallery': { car: '17 мин', walk: '50 мин' },
        'artmodern-gallery_darktrace-office': { car: '16 мин', walk: '47 мин' },
        'artmodern-gallery_police-department': { car: '4 мин', walk: '12 мин' },
        
        // 13. Квартира Маркуса - все маршруты
        'marcus-apartment_doctor-office': { car: '8 мин', walk: '22 мин' },
        'marcus-apartment_vault-gallery': { car: '19 мин', walk: '55 мин' },
        'marcus-apartment_darktrace-office': { car: '20 мин', walk: '58 мин' },
        'marcus-apartment_police-department': { car: '10 мин', walk: '28 мин' },
        
        // 14. Кабинет доктора - все маршруты
        'doctor-office_vault-gallery': { car: '21 мин', walk: '60 мин' },
        'doctor-office_darktrace-office': { car: '14 мин', walk: '40 мин' },
        'doctor-office_police-department': { car: '3 мин', walk: '8 мин' },
        
        // 15. Галерея Хранилище - все маршруты
        'vault-gallery_darktrace-office': { car: '23 мин', walk: '68 мин' },
        'vault-gallery_police-department': { car: '20 мин', walk: '58 мин' },
        
        // 16. Офис Dark Trace - все маршруты
        'darktrace-office_police-department': { car: '16 мин', walk: '47 мин' }
    };
    
    // Названия локаций для отображения
    const locationNames = {
        'selena-studio': 'Студия Селены Блэк',
        'arthur-house': 'Дом Артура Пейна',
        'dreamers-cafe': 'Кофейня «Мечтатели»',
        'alaric-attic': 'Мансарда Аларика',
        'vesper-studio': 'Фотостудия Веспер',
        'pharmacy': 'Аптека «Здоровье Ривертона»',
        'selena-apartment': 'Квартира Селены Блэк',
        'bank': 'Ривертон Коммершл Банк',
        'gulf-station': 'Заправка "Галф"',
        'onyx-restaurant': 'Ресторан «Оникс»',
        'underwood-mansion': 'Особняк Андервудов',
        'artmodern-gallery': 'Галерея «Арт-Модерн»',
        'marcus-apartment': 'Квартира Маркуса',
        'doctor-office': 'Кабинет доктора Майкла Элиота',
        'vault-gallery': 'Галерея «Хранилище»',
        'darktrace-office': 'Офис "Dark Trace"',
        'police-department': 'Департамент полиции Ривертона'
    };
    
    // Клик по маркеру на карте
    mapMarkers.forEach(marker => {
        marker.addEventListener('click', function() {
            const location = this.dataset.location;
            
            // Если уже выбрано 2 маркера, сбрасываем выбор
            if (selectedMarkers.length === 2 && !this.classList.contains('selected')) {
                mapMarkers.forEach(m => m.classList.remove('selected'));
                selectedMarkers = [];
            }
            
            // Переключаем выбор маркера
            if (this.classList.contains('selected')) {
                this.classList.remove('selected');
                selectedMarkers = selectedMarkers.filter(loc => loc !== location);
            } else {
                if (selectedMarkers.length < 2) {
                    this.classList.add('selected');
                    selectedMarkers.push(location);
                }
            }
            
            // Если выбрано 2 маркера, показываем расстояние
            if (selectedMarkers.length === 2) {
                calculateRouteFromMarkers(selectedMarkers[0], selectedMarkers[1]);
            } else {
                routeResult.classList.add('hidden');
            }
        });
    });
    
    // Функция расчета маршрута по выбранным маркерам
    function calculateRouteFromMarkers(loc1, loc2) {
        const key1 = `${loc1}_${loc2}`;
        const key2 = `${loc2}_${loc1}`;
        
        const time = routeTimes[key1] || routeTimes[key2];
        
        if (time) {
            const name1 = locationNames[loc1];
            const name2 = locationNames[loc2];
            
            routeTime.innerHTML = `
                <strong>${name1}</strong> → <strong>${name2}</strong><br>
                На машине: ~${time.car}<br>
                Пешком: ~${time.walk}
            `;
            routeResult.classList.remove('hidden');
            
            // Обновляем выпадающие списки
            if (routeStart && routeEnd) {
                routeStart.value = loc1;
                routeEnd.value = loc2;
            }
        }
    }
    
    if (calculateBtn) {
        calculateBtn.addEventListener('click', function() {
            const start = routeStart.value;
            const end = routeEnd.value;
            
            if (!start || !end) {
                showNotification('Ошибка', 'Выберите обе локации');
                return;
            }
            
            if (start === end) {
                showNotification('Ошибка', 'Выберите разные локации');
                return;
            }
            
            // Создаем ключ для поиска (в обе стороны)
            const key1 = `${start}_${end}`;
            const key2 = `${end}_${start}`;
            
            const time = routeTimes[key1] || routeTimes[key2];
            
            if (time) {
                const name1 = locationNames[start];
                const name2 = locationNames[end];
                
                routeTime.innerHTML = `
                    <strong>${name1}</strong> → <strong>${name2}</strong><br>
                    На машине: ~${time.car}<br>
                    Пешком: ~${time.walk}
                `;
                routeResult.classList.remove('hidden');
                
                // Подсвечиваем маркеры на карте
                mapMarkers.forEach(m => m.classList.remove('selected'));
                selectedMarkers = [start, end];
                mapMarkers.forEach(marker => {
                    if (marker.dataset.location === start || marker.dataset.location === end) {
                        marker.classList.add('selected');
                    }
                });
            } else {
                showNotification('Ошибка', 'Маршрут не найден');
            }
        });
    }
    
    if (timeFilter) {
        timeFilter.addEventListener('change', function() {
            const timeSlot = this.value;
            
            if (timeSlot) {
                showNotification(
                    'Фильтр по времени',
                    `Отображение местоположения персонажей в период ${timeSlot.replace('-', ':00-')}:00`
                );
            }
        });
    }
}

// Финальный отчет
function setupFinalReport() {
    const suspectSelect = document.getElementById('suspectSelect');
    const motiveSelect = document.getElementById('motiveSelect');
    const evidenceSelect = document.getElementById('evidenceSelect');
    const submitBtn = document.getElementById('submitFinalReportBtn');
    
    // Проверка заполнения всех полей
    function checkFormComplete() {
        if (suspectSelect && motiveSelect && evidenceSelect && submitBtn) {
            if (suspectSelect.value && motiveSelect.value && evidenceSelect.value) {
                submitBtn.disabled = false;
            } else {
                submitBtn.disabled = true;
            }
        }
    }
    
    if (suspectSelect) {
        suspectSelect.addEventListener('change', checkFormComplete);
    }
    
    if (motiveSelect) {
        motiveSelect.addEventListener('change', checkFormComplete);
    }
    
    if (evidenceSelect) {
        evidenceSelect.addEventListener('change', checkFormComplete);
    }
    
    if (submitBtn) {
        submitBtn.addEventListener('click', function() {
            const confirmed = confirm('Вы уверены? Это действие необратимо.');
            
            if (confirmed) {
                const suspect = suspectSelect.value;
                const motive = motiveSelect.value;
                const evidence = evidenceSelect.value;
                
                // В реальном проекте здесь проверка правильности ответов
                // Для демонстрации используем случайный результат
                const isCorrect = Math.random() > 0.5;
                
                if (isCorrect) {
                    window.location.href = 'epilogue-victory.html';
                } else {
                    window.location.href = 'epilogue-failure.html';
                }
            }
        });
    }
}



// Мобильное меню
function setupMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('mobileOverlay');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('mobile-visible');
            if (overlay) {
                overlay.classList.toggle('active');
            }
        });
        
        // Закрытие меню при клике на оверлей
        if (overlay) {
            overlay.addEventListener('click', function() {
                sidebar.classList.remove('mobile-visible');
                overlay.classList.remove('active');
            });
        }
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

