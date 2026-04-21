import type { CountryData } from '../model/types'

export default {
    id: "UZB",
    names: { ru: "Узбекистан", en: "Uzbekistan" },
    description: {
        ru: "Страна Великого шелкового пути, известная своими величественными городами Самарканд и Бухара.",
        en: "A country of the Silk Road, famous for its magnificent cities of Samarkand and Bukhara."
    },
    stats: { population: "34.9M", area: "447,400 km²", currency: "UZS" },
    keywords: ["uzb", "uzbekistan", "узбекистан"],
    cities: [
        { id: "tashkent", names: { ru: "Ташкент", en: "Tashkent" }, coords: { lat: 41.2995, lng: 69.2401 }, isCapital: true },
        { id: "samarkand", names: { ru: "Самарканд", en: "Samarkand" }, coords: { lat: 39.6270, lng: 66.9750 } }
    ]
} as CountryData