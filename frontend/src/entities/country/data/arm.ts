import type { CountryData } from '../model/types'

export default {
    id: "ARM",
    flag: "🇦🇲",
    names: { ru: "Армения", en: "Armenia" },
    description: {
        ru: "Древнейшее государство с богатой культурой в тени горы Арарат.",
        en: "An ancient state with a rich culture in the shadow of Mount Ararat."
    },
    stats: { population: "2.9M", area: "29,743 km²", currency: "AMD" },
    keywords: ["arm", "armenia", "армения"],
    cities: [
        { id: "yerevan", names: { ru: "Ереван", en: "Yerevan" }, coords: { lat: 40.1792, lng: 44.5152 }, isCapital: true },
        { id: "gyumri", names: { ru: "Гюмри", en: "Gyumri" }, coords: { lat: 40.7821, lng: 43.8311 } },
        { id: "vanadzor", names: { ru: "Ванадзор", en: "Vanadzor" }, coords: { lat: 40.8046, lng: 44.4939 } },
        { id: "vagharshapat", names: { ru: "Вагаршапат", en: "Vagharshapat" }, coords: { lat: 40.1644, lng: 44.2931 } },
        { id: "abovyan", names: { ru: "Абовян", en: "Abovyan" }, coords: { lat: 40.2726, lng: 44.6223 } }
    ]
} as CountryData