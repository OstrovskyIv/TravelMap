import type { CountryData } from '../model/types'

export default {
    id: "TJK",
    names: { ru: "Таджикистан", en: "Tajikistan" },
    description: {
        ru: "Высокогорная страна в Центральной Азии, где большую часть территории занимают горы Памира.",
        en: "A high-altitude country in Central Asia, where Pamir mountains cover most of the territory."
    },
    stats: { population: "9.5M", area: "143,100 km²", currency: "TJS" },
    keywords: ["tjk", "tajikistan", "таджикистан"],
    cities: [
        { id: "dushanbe", names: { ru: "Душанбе", en: "Dushanbe" }, coords: { lat: 38.5598, lng: 68.7870 }, isCapital: true },
        { id: "khujand", names: { ru: "Худжанд", en: "Khujand" }, coords: { lat: 40.2830, lng: 69.6222 } }
    ]
} as CountryData