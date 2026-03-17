import type { CountryData } from './index'

export default {
    id: "BLR",
    names: { ru: "Беларусь", en: "Belarus" },
    description: {
        ru: "Государство в Восточной Европе, известное своей богатой историей, бескрайними лесами и уникальной архитектурой замков.",
        en: "A country in Eastern Europe known for its rich history, vast forests, and unique castle architecture."
    },
    stats: {
        population: "9.2M",
        area: "207,595 km²",
        currency: "BYN"
    },
    keywords: ["blr", "belarus", "беларусь", "рб"],
    cities: [
        { id: "minsk", names: { ru: "Минск", en: "Minsk" }, coords: { lat: 53.9006, lng: 27.5590 }, isCapital: true },
        { id: "gomel", names: { ru: "Гомель", en: "Gomel" }, coords: { lat: 52.4345, lng: 30.9754 } },
        { id: "brest", names: { ru: "Брест", en: "Brest" }, coords: { lat: 52.0977, lng: 23.7341 } },
        { id: "grodno", names: { ru: "Гродно", en: "Grodno" }, coords: { lat: 53.6694, lng: 23.8165 } }
    ]
} as CountryData