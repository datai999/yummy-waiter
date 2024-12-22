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
import { syncServer, SYNC_TYPE } from './my-ws';

const lodash = _;

export const generateId = () => {
    const date = new Date();
    return date.toLocaleString("en-US", { timeZone: 'PST', hour12: false, dateStyle: 'short', timeStyle: 'medium' })
        + " " + date.getMilliseconds();
}

export const generateTables = () =>
    new Map(Array.from({ length: 21 }, (_, index) => {
        const id = String(index > 19 ? 'TOGO ' + (index - 19) : 'Table ' + (index < 12 ? index + 1 : index + 2));
        return [id, {
            id: id,
            status: TableStatus.AVAILABLE,
            orderTime: null,
            bags: new Map([
                [0, lodash.cloneDeep(INIT_SELECTED_ITEM)], [1, lodash.cloneDeep(INIT_SELECTED_ITEM)]
            ])
        } as Table]
    }));

export const changeTable = (tables: Map<String, Table>, fromTable: Table, toTableId: string): Table | null => {
    const toTable = tables.get(toTableId) as Table;
    if (!toTable) {
        console.error('Could not find toTableId:' + toTableId);
        return null;
    }

    toTable.status = fromTable.status;
    toTable.orderTime = fromTable.orderTime;
    fromTable.bags.forEach((selectedItem, index) => {
        toTable.bags.set(index, selectedItem);
    });

    fromTable.status = TableStatus.AVAILABLE;
    fromTable.orderTime = null;
    fromTable.bags = new Map([[0, lodash.cloneDeep(INIT_SELECTED_ITEM)], [1, lodash.cloneDeep(INIT_SELECTED_ITEM)]]);

    if (toTable.status === TableStatus.ACTIVE) {
        const data = { [fromTable.id]: fromTable, [toTableId]: toTable };
        syncServer(SYNC_TYPE.TABLE, data);
    }

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