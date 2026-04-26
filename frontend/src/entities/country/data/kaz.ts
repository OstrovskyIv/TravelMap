import type { CountryData } from '../model/types'

export default {
    id: "KAZ",
    flag: "🇰🇿",
    names: { ru: "Казахстан", en: "Kazakhstan" },
    description: {
        ru: "Сердце Евразии, край бескрайних степей и современных мегаполисов.",
        en: "The heart of Eurasia, a land of endless steppes and modern metropolises."
    },
    stats: { population: "19.2M", area: "2,724,900 km²", currency: "KZT" },
    keywords: ["kaz", "kazakhstan", "казахстан"],
    cities: [
        { id: "astana", names: { ru: "Астана", en: "Astana" }, coords: { lat: 51.1605, lng: 71.4704 }, isCapital: true },
        { id: "almaty", names: { ru: "Алматы", en: "Almaty" }, coords: { lat: 43.2220, lng: 76.8512 } },
        { id: "shymkent", names: { ru: "Шымкент", en: "Shymkent" }, coords: { lat: 42.3249, lng: 69.5901 } },
        { id: "karaganda", names: { ru: "Караганда", en: "Karaganda" }, coords: { lat: 49.8019, lng: 73.1021 } },
        { id: "aktobe", names: { ru: "Актобе", en: "Aktobe" }, coords: { lat: 50.2839, lng: 57.1669 } },
        { id: "taraz", names: { ru: "Тараз", en: "Taraz" }, coords: { lat: 42.9011, lng: 71.3783 } },
        { id: "pavlodar", names: { ru: "Павлодар", en: "Pavlodar" }, coords: { lat: 52.2873, lng: 76.9674 } },
        { id: "ust-kamenogorsk", names: { ru: "Усть-Каменогорск", en: "Oskemen" }, coords: { lat: 49.9520, lng: 82.6100 } },
        { id: "semey", names: { ru: "Семей", en: "Semey" }, coords: { lat: 50.4111, lng: 80.2222 } },
        { id: "atyrau", names: { ru: "Атырау", en: "Atyrau" }, coords: { lat: 47.0945, lng: 51.9238 } }
    ]
} as CountryData