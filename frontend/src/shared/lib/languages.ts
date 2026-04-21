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
}

export const languages = {
    ru: {
        navigation: {
            atlas: "Атлас",
            shop: "Магазин",
            options: "Опции",
            console: "Консоль",
            menu: "МЕНЮ"
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
            briefing: "Брифинг",
            nodes: "Активные узлы",
            scannerActive: "СКАНЕР: АКТИВЕН",
            target: "Объект"
        },
        shop: {
            title: "Магазин",
            subtitle: "Торговая площадка визуальных движков",
            collection: "Твоя коллекция",
            available: "Доступно",
            wallet: "Баланс кошелька",
            miles: "Мили"
        },
        settings: {
            title: "Настройки",
            subtitle: "Конфигурация системной среды",
            localization: "Локализация",
            setLanguage: "Установить основной язык системы",
            buildProtocol: "Протокол сборки"
        },
        admin: {
            terminal: "Админ-терминал",
            controlPanel: "Панель управления",
            economics: "Экономика",
            themes: "Доступ к темам",
            general: "Общие",
            users: "Пользователи",
            totalMiles: "Всего миль",
            status: "Статус",
            quickInjection: "Быстрая инъекция",
            manualOverwrite: "Ручная перезапись реестра",
            sync: "СИНХРОНИЗИРОВАТЬ",
            terminate: "Прекратить и очистить реестр"
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
        }
    },
    en: {
        navigation: {
            atlas: "Atlas",
            shop: "Shop",
            options: "Options",
            console: "Console",
            menu: "MENU"
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
            briefing: "Briefing",
            nodes: "Active Nodes",
            scannerActive: "SCANNER_MODE: ACTIVE",
            target: "Target"
        },
        shop: {
            title: "Style Shop",
            subtitle: "Visual Engine Marketplace",
            collection: "Your Collection",
            available: "Available",
            wallet: "Wallet Balance",
            miles: "Miles"
        },
        settings: {
            title: "Settings",
            subtitle: "System Environment Configuration",
            localization: "Localization",
            setLanguage: "Set primary system language",
            buildProtocol: "Build Protocol"
        },
        admin: {
            terminal: "Admin Terminal",
            controlPanel: "Control Panel",
            economics: "Economics",
            themes: "Theme Access",
            general: "General",
            users: "Users",
            totalMiles: "Total Miles",
            status: "Status",
            quickInjection: "Quick Injection",
            manualOverwrite: "Manual Registry Overwrite",
            sync: "SYNC",
            terminate: "Terminate and Wipe Registry"
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
        }
    }
} as const

export type LanguageCode = keyof typeof languages