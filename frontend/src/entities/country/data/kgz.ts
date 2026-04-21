import type { CountryData } from '../model/types'

export default {
    id: "KGZ",
    names: { ru: "Кыргызстан", en: "Kyrgyzstan" },
    description: {
        ru: "Страна в Центральной Азии, известная своими величественными горами Тянь-Шаня.",
        en: "A country in Central Asia known for its majestic Tian Shan mountains."
    },
    stats: { population: "6.6M", area: "199,951 km²", currency: "KGS" },
    keywords: ["kgz", "kyrgyzstan", "кыргызстан", "киргизия"],
    cities: [
        { id: "bishkek", names: { ru: "Бишкек", en: "Bishkek" }, coords: { lat: 42.8746, lng: 74.5698 }, isCapital: true },
        { id: "osh", names: { ru: "Ош", en: "Osh" }, coords: { lat: 40.5139, lng: 72.8161 } }
    ]
} as CountryData