import type { CountryData } from '../model/types'

export default {
    id: "RUS",
    flag: "🇷🇺",
    names: { ru: "Россия", en: "Russia" },
    description: {
        ru: "Самое большое государство мира, раскинувшееся от Балтийского моря до Тихого океана.",
        en: "The largest country in the world, stretching from the Baltic Sea to the Pacific Ocean."
    },
    stats: { population: "146M", area: "17,125,191 km²", currency: "RUB" },
    keywords: ["rus", "russia", "россия", "рф"],
    cities: [
        { id: "moscow", names: { ru: "Москва", en: "Moscow" }, coords: { lat: 55.7558, lng: 37.6173 }, isCapital: true },
        { id: "spb", names: { ru: "Санкт-Петербург", en: "St. Petersburg" }, coords: { lat: 59.9343, lng: 30.3351 } },
        { id: "novosibirsk", names: { ru: "Новосибирск", en: "Novosibirsk" }, coords: { lat: 55.0084, lng: 82.9357 } },
        { id: "yekaterinburg", names: { ru: "Екатеринбург", en: "Yekaterinburg" }, coords: { lat: 56.8389, lng: 60.6057 } },
        { id: "kazan", names: { ru: "Казань", en: "Kazan" }, coords: { lat: 55.7887, lng: 49.1221 } },
        { id: "nizhny", names: { ru: "Нижний Новгород", en: "Nizhny Novgorod" }, coords: { lat: 56.3269, lng: 44.0059 } },
        { id: "chelyabinsk", names: { ru: "Челябинск", en: "Chelyabinsk" }, coords: { lat: 55.1540, lng: 61.4291 } },
        { id: "samara", names: { ru: "Самара", en: "Samara" }, coords: { lat: 53.2415, lng: 50.2212 } },
        { id: "omsk", names: { ru: "Омск", en: "Omsk" }, coords: { lat: 54.9885, lng: 73.3237 } },
        { id: "rostov", names: { ru: "Ростов-на-Дону", en: "Rostov-on-Don" }, coords: { lat: 47.2357, lng: 39.7015 } },
        { id: "ufa", names: { ru: "Уфа", en: "Ufa" }, coords: { lat: 54.7388, lng: 55.9721 } },
        { id: "krasnoyarsk", names: { ru: "Красноярск", en: "Krasnoyarsk" }, coords: { lat: 56.0153, lng: 92.8932 } },
        { id: "voronezh", names: { ru: "Воронеж", en: "Voronezh" }, coords: { lat: 51.6608, lng: 39.2003 } },
        { id: "perm", names: { ru: "Пермь", en: "Perm" }, coords: { lat: 58.0105, lng: 56.2502 } },
        { id: "volgograd", names: { ru: "Волгоград", en: "Volgograd" }, coords: { lat: 48.7080, lng: 44.5133 } },
        { id: "krasnodar", names: { ru: "Краснодар", en: "Krasnodar" }, coords: { lat: 45.0355, lng: 38.9747 } },
        { id: "saratov", names: { ru: "Саратов", en: "Saratov" }, coords: { lat: 51.5336, lng: 46.0342 } },
        { id: "tyumen", names: { ru: "Тюмень", en: "Tyumen" }, coords: { lat: 57.1522, lng: 65.5272 } },
        { id: "togliatti", names: { ru: "Тольятти", en: "Togliatti" }, coords: { lat: 53.5078, lng: 49.4192 } },
        { id: "izhevsk", names: { ru: "Ижевск", en: "Izhevsk" }, coords: { lat: 56.8527, lng: 53.2114 } },
        { id: "vladivostok", names: { ru: "Владивосток", en: "Vladivostok" }, coords: { lat: 43.1155, lng: 131.8855 } }
    ]
} as CountryData