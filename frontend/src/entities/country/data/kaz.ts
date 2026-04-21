import type { CountryData } from '../model/types'

export default {
    id: "KAZ",
    names: { ru: "Казахстан", en: "Kazakhstan" },
    description: {
        ru: "Девятое по площади государство мира, расположенное в центре Евразии.",
        en: "The ninth-largest country in the world, located in the center of Eurasia."
    },
    stats: { population: "19.2M", area: "2,724,900 km²", currency: "KZT" },
    keywords: ["kaz", "kazakhstan", "казахстан", "рк"],
    cities: [
        { id: "astana", names: { ru: "Астана", en: "Astana" }, coords: { lat: 51.1605, lng: 71.4704 }, isCapital: true },
        { id: "almaty", names: { ru: "Алматы", en: "Almaty" }, coords: { lat: 43.2220, lng: 76.8512 } }
    ]
} as CountryData