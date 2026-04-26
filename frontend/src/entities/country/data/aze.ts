import type { CountryData } from '../model/types'

export default {
    id: "AZE",
    flag: "🇦🇿",
    names: { ru: "Азербайджан", en: "Azerbaijan" },
    description: {
        ru: "Страна огней на берегу Каспия, где встречаются Восток и Запад.",
        en: "The land of fire on the Caspian shore, where East meets West."
    },
    stats: { population: "10.1M", area: "86,600 km²", currency: "AZN" },
    keywords: ["aze", "azerbaijan", "азербайджан"],
    cities: [
        { id: "baku", names: { ru: "Баку", en: "Baku" }, coords: { lat: 40.4093, lng: 49.8671 }, isCapital: true },
        { id: "ganja", names: { ru: "Гянджа", en: "Ganja" }, coords: { lat: 40.6828, lng: 46.3606 } },
        { id: "sumqayit", names: { ru: "Сумгаит", en: "Sumgait" }, coords: { lat: 40.5897, lng: 49.6689 } },
        { id: "lankaran", names: { ru: "Ленкорань", en: "Lankaran" }, coords: { lat: 38.7529, lng: 48.8511 } },
        { id: "mingachevir", names: { ru: "Мингечевир", en: "Mingachevir" }, coords: { lat: 40.7640, lng: 47.0595 } }
    ]
} as CountryData