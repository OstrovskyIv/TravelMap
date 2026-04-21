import type { CountryData } from '../model/types'

export default {
    id: "BLR",
    names: { ru: "Беларусь", en: "Belarus" },
    description: {
        ru: "Государство в Восточной Европе, известное своими бескрайними лесами и замками.",
        en: "A country in Eastern Europe known for its vast forests and castles."
    },
    stats: { population: "9.2M", area: "207,595 km²", currency: "BYN" },
    keywords: ["blr", "belarus", "беларусь", "рб"],
    cities: [
        { id: "minsk", names: { ru: "Минск", en: "Minsk" }, coords: { lat: 53.9006, lng: 27.5590 }, isCapital: true },
        { id: "gomel", names: { ru: "Гомель", en: "Gomel" }, coords: { lat: 52.4345, lng: 30.9754 } }
    ]
} as CountryData