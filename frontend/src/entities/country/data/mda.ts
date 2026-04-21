import type { CountryData } from '../model/types'

export default {
    id: "MDA",
    names: { ru: "Молдова", en: "Moldova" },
    description: {
        ru: "Страна в Восточной Европе, славящаяся своими виноградниками и гостеприимством.",
        en: "A country in Eastern Europe famous for its vineyards and hospitality."
    },
    stats: { population: "2.6M", area: "33,846 km²", currency: "MDL" },
    keywords: ["mda", "moldova", "молдова", "молдавия"],
    cities: [
        { id: "chisinau", names: { ru: "Кишинёв", en: "Chisinau" }, coords: { lat: 47.0105, lng: 28.8638 }, isCapital: true },
        { id: "balti", names: { ru: "Бельцы", en: "Balti" }, coords: { lat: 47.7617, lng: 27.9289 } }
    ]
} as CountryData