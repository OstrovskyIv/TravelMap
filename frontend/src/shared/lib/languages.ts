export type LanguageCategory = { [key: string]: string }

export interface LanguageTree {
    navigation: LanguageCategory
    auth: LanguageCategory
    info: LanguageCategory
    shop: LanguageCategory
    settings: LanguageCategory
    admin: LanguageCategory
    stats: LanguageCategory
    search: LanguageCategory
    tools: LanguageCategory
    tooltips: LanguageCategory
    vip: LanguageCategory
    games: LanguageCategory
    leaderboard: LanguageCategory
    achievements: LanguageCategory
}

export const languages = {
    ru: {
        navigation: {
            atlas: "Атлас",
            shop: "Магазин",
            options: "Опции",
            console: "Консоль",
            menu: "МЕНЮ",
            games: "Игры",
            profile: "Профиль",
            leaderboard: "Лидеры",
            achievements: "Награды"
        },
        auth: {
            confirmation: "Подтверждение",
            title: "Разблокировать регион?",
            subtitle: "Это действие добавит территорию в ваш журнал полетов.",
            confirmBtn: "Подтвердить",
            abortBtn: "Отмена"
        },
        info: {
            sector: "Сектор разведки",
            summary: "Обзор",
            memories: "Альбомы",
            discussion: "Обсуждение",
            cities: "Города",
            gallery: "Галерея",
            registry: "Реестр данных",
            interest: "Интерес",
            cleanliness: "Чистота",
            friendliness: "Люди",
            difficulty: "Доступ",
            infrastructure: "Инфраструктура",
            sendMessage: "Написать сообщение...",
            searchPlaceholder: "Поиск в логах...",
            createAlbum: "Создать альбом",
            albumName: "Название альбома",
            back: "Назад к стране",
            visitBtn: "Посетить",
            visited: "Посещено",
            reply: "Ответ на",
            photoAttached: "Фото прикреплено",
            addCaption: "Описание...",
            noData: "Данных в этом секторе пока нет..."
        },
        shop: {
            title: "Магазин",
            subtitle: "Торговая площадка визуальных движков",
            collection: "Твоя коллекция",
            available: "Доступно",
            wallet: "Баланс",
            miles: "Мили"
        },
        settings: {
            title: "Настройки",
            subtitle: "Конфигурация системной среды",
            general: "Общие",
            profile: "Профиль",
            interface: "Интерфейс",
            security: "Безопасность",
            localization: "Локализация",
            setLanguage: "Язык системы",
            mapTools: "Инструменты карты",
            hints: "Подсказки",
            startTour: "Запустить обучение",
            buildProtocol: "Протокол сборки",
            interfaceProtocol: "Протокол интерфейса",
            enabled: "Включено",
            disabled: "Выключено",
            theme: "Тема оформления",
            training: "Обучение системы",
            initiateCourse: "Начать курс",
            tourDesc: "Интерактивный гид по системе",
            profileDesc: "Настройка личного узла данных скоро будет доступна..."
        },
        admin: {
            terminal: "Админ-терминал",
            economics: "Экономика",
            themes: "Темы",
            users: "Пользователи",
            logs: "Логи",
            totalMiles: "Билеты",
            status: "Статус",
            quickInjection: "Инъекция",
            manualOverwrite: "Перезапись",
            sync: "СИНХРОНИЗИРОВАТЬ",
            terminate: "Очистить реестр",
            controlPanel: "Панель управления"
        },
        stats: {
            log: "Журнал",
            regions: "Регионы"
        },
        search: {
            placeholder: "Поиск территорий...",
            profile: "Профиль территории"
        },
        tools: {
            labels: "Названия",
            magnifier: "Лупа",
            draw: "Рисовать"
        },
        tooltips: {
            showLabels: "Глобальные подписи",
            hideLabels: "Скрыть подписи",
            cursorLabel: "Сканер у курсора",
            route: "Построить маршрут",
            undo: "Отменить шаг",
            clear: "Очистить путь",
            zoomIn: "Приближение",
            zoomOut: "Отдаление"
        },
        vip: {
            title: "VIP Статус",
            subtitle: "Протокол расширенного доступа",
            upgrade: "Купить VIP",
            active: "VIP Активен",
            photoLimit: "Лимит фото",
            posts: "Доступ к чатам",
            buyBtn: "Активировать статус",
            close: "Закрыть"
        },
        games: {
            title: "Игровой Терминал",
            guessFlag: "Угадай флаг",
            guessFlagDesc: "Зарабатывай билеты, угадывая флаги стран",
            start: "Начать игру",
            next: "Следующий вопрос",
            reward: "Награда",
            win: "Верно!",
            lose: "Ошибка!",
            exit: "Выход"
        },
        leaderboard: {
            title: "Элита Мира",
            users: "Пилоты",
            countries: "Страны",
            cities: "Города",
            rank: "Ранг",
            user: "Пилот",
            score: "Рейтинг",
            balance: "Билеты",
            visits: "Визиты",
            pts: "pts"
        },
        achievements: {
            title: "Достижения",
            unlocked: "Разблокировано",
            locked: "Заблокировано",
            explorer: "Исследователь",
            millionaire: "Миллионер"
        }
    },
    en: {
        navigation: {
            atlas: "Atlas",
            shop: "Shop",
            options: "Options",
            console: "Console",
            menu: "MENU",
            games: "Games",
            profile: "Profile",
            leaderboard: "Board",
            achievements: "Rewards"
        },
        auth: {
            confirmation: "Authorization",
            title: "Unlock Region?",
            subtitle: "This action will add the territory to your flight log.",
            confirmBtn: "Confirm Access",
            abortBtn: "Abort"
        },
        info: {
            sector: "Sector Intelligence",
            summary: "Summary",
            memories: "Albums",
            discussion: "Discussion",
            cities: "Cities",
            gallery: "Gallery",
            registry: "Data Registry",
            interest: "Interest",
            cleanliness: "Cleanliness",
            friendliness: "People",
            difficulty: "Access",
            infrastructure: "Infrastructure",
            sendMessage: "Type a message...",
            searchPlaceholder: "Search logs...",
            createAlbum: "New Album",
            albumName: "Album Title",
            back: "Back to Country",
            visitBtn: "Visit",
            visited: "Visited",
            reply: "Reply to",
            photoAttached: "Photo Attached",
            addCaption: "Caption...",
            noData: "No telemetry in this sector..."
        },
        shop: {
            title: "Style Shop",
            subtitle: "Visual Engine Marketplace",
            collection: "Your Collection",
            available: "Available",
            wallet: "Wallet",
            miles: "Miles"
        },
        settings: {
            title: "Settings",
            subtitle: "System Environment Configuration",
            general: "General",
            profile: "Profile",
            interface: "Interface",
            security: "Security",
            localization: "Localization",
            setLanguage: "System Language",
            mapTools: "Map Tools",
            hints: "Hints",
            startTour: "Start Training",
            buildProtocol: "Build Protocol",
            interfaceProtocol: "Interface Protocol",
            enabled: "Enabled",
            disabled: "Disabled",
            theme: "Visual Theme",
            training: "System Training",
            initiateCourse: "Initiate Course",
            tourDesc: "Interactive site walkthrough",
            profileDesc: "Profile customization protocol coming soon..."
        },
        admin: {
            terminal: "Admin Terminal",
            economics: "Economics",
            themes: "Themes",
            users: "Users",
            logs: "Logs",
            totalMiles: "Credits",
            status: "Status",
            quickInjection: "Injection",
            manualOverwrite: "Overwrite",
            sync: "SYNC",
            terminate: "Wipe Registry",
            controlPanel: "Control Panel"
        },
        stats: {
            log: "Travel Log",
            regions: "Regions"
        },
        search: {
            placeholder: "Search territories...",
            profile: "Territory Profile"
        },
        tools: {
            labels: "Labels",
            magnifier: "Magnifier",
            draw: "Draw"
        },
        tooltips: {
            showLabels: "Global Labels",
            hideLabels: "Hide Labels",
            cursorLabel: "Cursor Scanner",
            route: "Draw Route",
            undo: "Undo step",
            clear: "Clear Path",
            zoomIn: "Increase Scale",
            zoomOut: "Decrease Scale"
        },
        vip: {
            title: "VIP Status",
            subtitle: "Advanced Access Protocol",
            upgrade: "Upgrade to VIP",
            active: "VIP Active",
            photoLimit: "Photo Limit",
            posts: "Chat Access",
            buyBtn: "Activate Access",
            close: "Close"
        },
        games: {
            title: "Game Terminal",
            guessFlag: "Guess Flag",
            guessFlagDesc: "Earn credits by guessing country flags",
            start: "Start Game",
            next: "Next Question",
            reward: "Reward",
            win: "Correct!",
            lose: "Wrong!",
            exit: "Exit"
        },
        leaderboard: {
            title: "Global Elite",
            users: "Pilots",
            countries: "Regions",
            cities: "Cities",
            rank: "Rank",
            user: "Pilot",
            score: "Score",
            balance: "Credits",
            visits: "Visits",
            pts: "pts"
        },
        achievements: {
            title: "Achievements",
            unlocked: "Unlocked",
            locked: "Locked",
            explorer: "Explorer",
            millionaire: "Millionaire"
        }
    }
} as const

export type LanguageCode = keyof typeof languages