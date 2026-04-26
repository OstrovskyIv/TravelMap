import type { CountryData } from '../model/types'

export default {
    id: "NZL",
    flag: "🇳🇿",
    names: { ru: "Новая Зеландия", en: "New Zealand" },
    description: {
        ru: "Страна длинного белого облака, фьордов и хоббитов.",
        en: "The land of the long white cloud, fjords and hobbits."
    },
    stats: { population: "5.1M", area: "268,021 km²", currency: "NZD" },
    keywords: ["nzl", "new zealand", "новая зеландия"],
    cities: [
        { id: "wellington", names: { ru: "Веллингтон", en: "Wellington" }, coords: { lat: -41.2865, lng: 174.7762 }, isCapital: true },
        { id: "auckland", names: { ru: "Окленд", en: "Auckland" }, coords: { lat: -36.8485, lng: 174.7633 } },
        { id: "christchurch", names: { ru: "Крайстчерч", en: "Christchurch" }, coords: { lat: -43.5321, lng: 172.6362 } },
        { id: "hamilton", names: { ru: "Гамильтон", en: "Hamilton" }, coords: { lat: -37.7870, lng: 175.2793 } },
        { id: "tauranga", names: { ru: "Тауранга", en: "Tauranga" }, coords: { lat: -37.6858, lng: 176.1667 } }
    ]
} as CountryData