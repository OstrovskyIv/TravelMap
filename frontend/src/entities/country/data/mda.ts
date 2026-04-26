import type { CountryData } from '../model/types'

export default {
    id: "MDA",
    flag: "🇲🇩",
    names: { ru: "Молдова", en: "Moldova" },
    description: {
        ru: "Край виноградников и гостеприимства в Восточной Европе.",
        en: "A land of vineyards and hospitality in Eastern Europe."
    },
    stats: { population: "2.6M", area: "33,846 km²", currency: "MDL" },
    keywords: ["mda", "moldova", "молдова"],
    cities: [
        { id: "chisinau", names: { ru: "Кишинёв", en: "Chisinau" }, coords: { lat: 47.0105, lng: 28.8638 }, isCapital: true },
        { id: "balti", names: { ru: "Бельцы", en: "Balti" }, coords: { lat: 47.7617, lng: 27.9289 } },
        { id: "tiraspol", names: { ru: "Тирасполь", en: "Tiraspol" }, coords: { lat: 46.8403, lng: 29.6308 } },
        { id: "bender", names: { ru: "Бендеры", en: "Bender" }, coords: { lat: 46.8242, lng: 29.4811 } },
        { id: "cahul", names: { ru: "Кагул", en: "Cahul" }, coords: { lat: 45.9000, lng: 28.1833 } }
    ]
} as CountryData