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
            discussion: "Чат",
            cities: "Города",
            registry: "Реестр",
            interest: "Интерес",
            cleanliness: "Чистота",
            friendliness: "Люди",
            difficulty: "Доступ",
            sendMessage: "Написать сообщение...",
            createAlbum: "Создать альбом",
            albumName: "Название альбома",
            back: "Назад",
            visitBtn: "Посетить",
            visited: "Посещено",
            shareExp: "Поделиться..."
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
            buildProtocol: "Протокол сборки"
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
            title: "Таблица лидеров",
            distance: "По дистанции",
            discoveries: "По открытиям",
            rank: "Ранг",
            user: "Пилот",
            value: "Значение"
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
            discussion: "Chat",
            cities: "Cities",
            registry: "Registry",
            interest: "Interest",
            cleanliness: "Cleanliness",
            friendliness: "People",
            difficulty: "Access",
            sendMessage: "Type a message...",
            createAlbum: "New Album",
            albumName: "Album Title",
            back: "Back",
            visitBtn: "Visit",
            visited: "Visited",
            shareExp: "Share experience..."
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
            buildProtocol: "Build Protocol"
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
            title: "Leaderboard",
            distance: "By Distance",
            discoveries: "By Discoveries",
            rank: "Rank",
            user: "Pilot",
            value: "Value"
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