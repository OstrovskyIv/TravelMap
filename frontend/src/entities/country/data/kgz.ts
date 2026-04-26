import type { CountryData } from '../model/types'

export default {
    id: "KGZ",
    flag: "🇰🇬",
    names: { ru: "Кыргызстан", en: "Kyrgyzstan" },
    description: {
        ru: "Страна небесных гор Тянь-Шаня и высокогорного озера Иссык-Куль.",
        en: "The land of the celestial Tian Shan mountains and the high-altitude Lake Issyk-Kul."
    },
    stats: { population: "6.6M", area: "199,951 km²", currency: "KGS" },
    keywords: ["kgz", "kyrgyzstan", "кыргызстан"],
    cities: [
        { id: "bishkek", names: { ru: "Бишкек", en: "Bishkek" }, coords: { lat: 42.8746, lng: 74.5698 }, isCapital: true },
        { id: "osh", names: { ru: "Ош", en: "Osh" }, coords: { lat: 40.5139, lng: 72.8161 } },
        { id: "jalal-abad", names: { ru: "Джалал-Абад", en: "Jalal-Abad" }, coords: { lat: 40.9333, lng: 72.9833 } },
        { id: "karakol", names: { ru: "Каракол", en: "Karakol" }, coords: { lat: 42.4907, lng: 78.3936 } },
        { id: "tokmok", names: { ru: "Токмок", en: "Tokmok" }, coords: { lat: 42.8419, lng: 75.3015 } }
    ]
} as CountryData