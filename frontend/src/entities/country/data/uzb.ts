import type { CountryData } from '../model/types'

export default {
    id: "UZB",
    flag: "🇺🇿",
    names: { ru: "Узбекистан", en: "Uzbekistan" },
    description: {
        ru: "Жемчужина Великого шелкового пути с древнейшей архитектурой Самарканда и Бухары.",
        en: "The pearl of the Silk Road with the ancient architecture of Samarkand and Bukhara."
    },
    stats: { population: "34.9M", area: "447,400 km²", currency: "UZS" },
    keywords: ["uzb", "uzbekistan", "узбекистан"],
    cities: [
        { id: "tashkent", names: { ru: "Ташкент", en: "Tashkent" }, coords: { lat: 41.2995, lng: 69.2401 }, isCapital: true },
        { id: "namangan", names: { ru: "Наманган", en: "Namangan" }, coords: { lat: 41.0011, lng: 71.6683 } },
        { id: "samarkand", names: { ru: "Самарканд", en: "Samarkand" }, coords: { lat: 39.6270, lng: 66.9750 } },
        { id: "andijan", names: { ru: "Андижан", en: "Andijan" }, coords: { lat: 40.7821, lng: 72.3442 } },
        { id: "nukus", names: { ru: "Нукус", en: "Nukus" }, coords: { lat: 42.4533, lng: 59.6108 } },
        { id: "bukhara", names: { ru: "Бухара", en: "Bukhara" }, coords: { lat: 39.7747, lng: 64.4286 } },
        { id: "fergana", names: { ru: "Фергана", en: "Fergana" }, coords: { lat: 40.3844, lng: 71.7844 } },
        { id: "karshi", names: { ru: "Карши", en: "Karshi" }, coords: { lat: 38.8610, lng: 65.7847 } }
    ]
} as CountryData