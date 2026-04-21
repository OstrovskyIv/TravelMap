import type { CountryData } from '../model/types'

export default {
    id: "NZL",
    names: { ru: "Новая Зеландия", en: "New Zealand" },
    description: {
        ru: "Островное государство в юго-западной части Тихого океана, известное своими фьордами и горами.",
        en: "An island country in the southwestern Pacific Ocean, known for its fjords and mountains."
    },
    stats: { population: "5.1M", area: "268,021 km²", currency: "NZD" },
    keywords: ["nzl", "new zealand", "новая зеландия"],
    cities: [
        { id: "wellington", names: { ru: "Веллингтон", en: "Wellington" }, coords: { lat: -41.2865, lng: 174.7762 }, isCapital: true },
        { id: "auckland", names: { ru: "Окленд", en: "Auckland" }, coords: { lat: -36.8485, lng: 174.7633 } }
    ]
} as CountryData