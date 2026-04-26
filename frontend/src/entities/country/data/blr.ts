import type { CountryData } from '../model/types'

export default {
    id: "BLR",
    flag: "🇧🇾",
    names: { ru: "Беларусь", en: "Belarus" },
    description: {
        ru: "Страна замков, лесов и озер в самом центре Европы.",
        en: "Country of castles, forests and lakes in the very center of Europe."
    },
    stats: { population: "9.2M", area: "207,595 km²", currency: "BYN" },
    keywords: ["blr", "belarus", "беларусь"],
    cities: [
        { id: "minsk", names: { ru: "Минск", en: "Minsk" }, coords: { lat: 53.9006, lng: 27.5590 }, isCapital: true },
        { id: "gomel", names: { ru: "Гомель", en: "Gomel" }, coords: { lat: 52.4345, lng: 30.9754 } },
        { id: "mogilev", names: { ru: "Могилёв", en: "Mogilev" }, coords: { lat: 53.8981, lng: 30.3325 } },
        { id: "vitebsk", names: { ru: "Витебск", en: "Vitebsk" }, coords: { lat: 55.1927, lng: 30.2064 } },
        { id: "grodno", names: { ru: "Гродно", en: "Grodno" }, coords: { lat: 53.6694, lng: 23.8131 } },
        { id: "brest", names: { ru: "Брест", en: "Brest" }, coords: { lat: 52.0977, lng: 23.7341 } },
        { id: "bobruisk", names: { ru: "Бобруйск", en: "Bobruisk" }, coords: { lat: 53.1384, lng: 29.2214 } },
        { id: "baranovichi", names: { ru: "Барановичи", en: "Baranovichi" }, coords: { lat: 53.1327, lng: 26.0139 } },
        { id: "pinsk", names: { ru: "Пинск", en: "Pinsk" }, coords: { lat: 52.1153, lng: 26.1031 } },
        { id: "mozyr", names: { ru: "Мозырь", en: "Mozyr" }, coords: { lat: 52.0495, lng: 29.2456 } }
    ]
} as CountryData