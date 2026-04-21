import type { CountryData } from '../model/types'

export default {
    id: "AZE",
    names: { ru: "Азербайджан", en: "Azerbaijan" },
    description: {
        ru: "Страна на побережье Каспийского моря, сочетающая в себе современные небоскребы и древнюю культуру.",
        en: "A country on the Caspian Sea coast, combining modern skyscrapers with ancient culture."
    },
    stats: { population: "10.1M", area: "86,600 km²", currency: "AZN" },
    keywords: ["aze", "azerbaijan", "азербайджан"],
    cities: [
        { id: "baku", names: { ru: "Баку", en: "Baku" }, coords: { lat: 40.4093, lng: 49.8671 }, isCapital: true },
        { id: "ganja", names: { ru: "Гянджа", en: "Ganja" }, coords: { lat: 40.6828, lng: 46.3606 } }
    ]
} as CountryData