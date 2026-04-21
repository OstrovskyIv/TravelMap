import type { CountryData } from '../model/types'

export default {
    id: "ARM",
    names: { ru: "Армения", en: "Armenia" },
    description: {
        ru: "Древнее государство в Закавказье, известное своими горными пейзажами и старинными монастырями.",
        en: "An ancient country in the South Caucasus, known for its mountainous landscapes and historic monasteries."
    },
    stats: { population: "2.9M", area: "29,743 km²", currency: "AMD" },
    keywords: ["arm", "armenia", "армения", "хайастан"],
    cities: [
        { id: "yerevan", names: { ru: "Ереван", en: "Yerevan" }, coords: { lat: 40.1792, lng: 44.5152 }, isCapital: true },
        { id: "gyumri", names: { ru: "Гюмри", en: "Gyumri" }, coords: { lat: 40.7821, lng: 43.8311 } }
    ]
} as CountryData