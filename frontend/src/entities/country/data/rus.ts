import type { CountryData } from '../model/types'

export default {
    id: "RUS",
    names: { ru: "Россия", en: "Russia" },
    description: {
        ru: "Самое большое государство в мире, охватывающее 11 часовых поясов.",
        en: "The largest country in the world, spanning 11 time zones."
    },
    stats: { population: "146M", area: "17,125,191 km²", currency: "RUB" },
    keywords: ["rus", "russia", "россия", "рф"],
    cities: [
        { id: "moscow", names: { ru: "Москва", en: "Moscow" }, coords: { lat: 55.7558, lng: 37.6173 }, isCapital: true },
        { id: "spb", names: { ru: "Санкт-Петербург", en: "St. Petersburg" }, coords: { lat: 59.9343, lng: 30.3351 } }
    ]
} as CountryData