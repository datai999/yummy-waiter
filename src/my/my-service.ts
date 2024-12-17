import {
    Pho,
    PhoCode,
    SelectedItem,
} from 'myTypes';

import {
    BeefMeatCodes,
    BeefPreferenceCodes,
    Categories,
    ChickenMeats,
    ChikenPreferences,
    INIT_SELECTED_ITEM,
    Noodles,
    TableStatus,
} from './my-constants';
import { Table } from 'myTable';
import _ from 'lodash';

const lodash = _;

export const generateId = () => {
    const date = new Date();
    return date.toLocaleString("en-US", { timeZone: 'PST', hour12: false, dateStyle: 'short', timeStyle: 'medium' })
        + " " + date.getMilliseconds();
}

export const generateTables = () => {
    const realTable = 9;
    return Array.from({ length: 21 }, (_, index) => ({
        id: String(index > 19 ? 'TOGO ' + (index - 19) : 'Table ' + (index < 12 ? index + 1 : index + 2)),
        status: index < realTable ? TableStatus.AVAILABLE : Math.random() > 0.9 ? TableStatus.AVAILABLE : TableStatus.ACTIVE,
        orderTime: index < realTable ? null : new Date(Date.now() - Math.floor(Math.random() * 3600000)),
        bags: index < realTable
            ? new Map([
                [0, lodash.cloneDeep(INIT_SELECTED_ITEM)], [1, lodash.cloneDeep(INIT_SELECTED_ITEM)]
            ])
            : new Map([
                [0, {
                    ...INIT_SELECTED_ITEM,
                    beef: new Map([
                        [generateId(), {
                            id: generateId(),
                            meats: [],
                            noodle: "REGULAR",
                            meatCodes: "BPN",
                            noodleCode: "BC",
                        }]]),
                    chicken: new Map([
                        [generateId(), {
                            id: generateId(),
                            meats: [],
                            noodle: "REGULAR",
                            meatCodes: "Đùi",
                            noodleCode: "BC",
                        }]]),
                }]
            ])
    } as Table));
}

export const changeTable = (tables: Table[], fromTable: Table, toTableId: string): Table => {
    const toTable = tables.find(table => table.id === toTableId) as Table;

    toTable.status = fromTable.status;
    toTable.orderTime = fromTable.orderTime;
    fromTable.bags.forEach((selectedItem, index) => {
        toTable.bags.set(index, selectedItem);
    });

    fromTable.status = TableStatus.AVAILABLE;
    fromTable.orderTime = null;
    fromTable.bags = new Map([[0, lodash.cloneDeep(INIT_SELECTED_ITEM)], [1, lodash.cloneDeep(INIT_SELECTED_ITEM)]]);

    return toTable;
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

export const selectedNotEmpty = (selectedItem: SelectedItem): boolean => {
    return selectedItem.beef.size > 0
        || selectedItem.beefSide.size > 0
        || selectedItem.chicken.size > 0
        || selectedItem.chickenSide.size > 0
        || selectedItem.drink.size > 0
        || selectedItem.dessert.size > 0
        ;
}