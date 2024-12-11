import {
  Pho,
  PhoCode,
} from 'myTypes';

import {
  BeefMeatCodes,
  BeefPreferenceCodes,
  Categories,
  ChickenMeats,
  ChikenPreferences,
  Noodles,
} from './my-constants';

export const generateId = () => {
    const date = new Date();
    return date.toLocaleString("en-US", { timeZone: 'PST', hour12: false, dateStyle: 'short', timeStyle: 'medium' })
        + " " + date.getMilliseconds();
}

export const toPhoCode = (category: Categories, pho: Pho): PhoCode => {
    const id = pho.id.length ? pho.id : generateId();
    const phoCode = { ...pho, id: id } as PhoCode;

    phoCode.noodleCode = Noodles[phoCode.noodle as keyof typeof Noodles] as string;

    if (Categories.CHICKEN === category) {
        phoCode.meatCodes = phoCode.meats.map(e => ChickenMeats[e as keyof typeof ChickenMeats]).join(',');
        phoCode.preferenceCodes = (phoCode.preferences || [])
            .map(e => ChikenPreferences[e as keyof typeof ChikenPreferences])
            .join(", ");
        return phoCode;
    }

    if (phoCode.meats.length === 0) phoCode.meats = ["BPN"];
    else phoCode.meats = phoCode.meats.filter(meat => meat !== "BPN");
    phoCode.meatCodes = phoCode.meats.map(e => BeefMeatCodes[e as keyof typeof BeefMeatCodes]).join(',');
    phoCode.preferenceCodes = (phoCode.preferences || [])
        .map(e => BeefPreferenceCodes[e as keyof typeof BeefPreferenceCodes])
        .join(", ");
    return phoCode;
}