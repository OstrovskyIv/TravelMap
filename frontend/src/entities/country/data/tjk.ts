import type { CountryData } from '../model/types'

export default {
    id: "TJK",
    flag: "🇹🇯",
    names: { ru: "Таджикистан", en: "Tajikistan" },
    description: {
        ru: "Крыша мира — страна величественных гор Памира.",
        en: "The Roof of the World — the land of the majestic Pamir mountains."
    },
    stats: { population: "9.5M", area: "143,100 km²", currency: "TJS" },
    keywords: ["tjk", "tajikistan", "таджикистан"],
    cities: [
        { id: "dushanbe", names: { ru: "Душанбе", en: "Dushanbe" }, coords: { lat: 38.5598, lng: 68.7870 }, isCapital: true },
        { id: "khujand", names: { ru: "Худжанд", en: "Khujand" }, coords: { lat: 40.2830, lng: 69.6222 } },
        { id: "kulob", names: { ru: "Куляб", en: "Kulob" }, coords: { lat: 37.9147, lng: 69.7811 } },
        { id: "bokhtar", names: { ru: "Бохтар", en: "Bokhtar" }, coords: { lat: 37.8364, lng: 68.7803 } },
        { id: "istaravshan", names: { ru: "Истаравшан", en: "Istaravshan" }, coords: { lat: 39.9142, lng: 69.0033 } }
    ]
} as CountryData