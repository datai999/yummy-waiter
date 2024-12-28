import {
    BEEF_MEAT,
    Categories,
    TableStatus,
} from './my-constants';
import _ from 'lodash';
import { syncServer, SYNC_TYPE } from './my-ws';
import { Pho, SelectedItem, Table } from './my-class';

const lodash = _;

export const generateId = () => {
    const date = new Date();
    return date.toLocaleString("en-US", { timeZone: 'PST', hour12: false, dateStyle: 'short', timeStyle: 'medium' })
        + " " + date.getMilliseconds();
}

export const sortBeefMeat = (a: string, b: string) =>
    BEEF_MEAT[a as keyof typeof BEEF_MEAT].sort
    - BEEF_MEAT[b as keyof typeof BEEF_MEAT].sort;

export const generateTables = () =>
    new Map(Array.from({ length: 21 }, (_, index) => {
        const id = String(index > 19 ? 'TOGO ' + (index - 19) : 'Table ' + (index < 12 ? index + 1 : index + 2));
        return [id, new Table(id)]
    }));

export const completePho = (pho: Pho) => {
    pho.id = pho.id.length > 0 ? pho.id : generateId();
    pho.meats = pho.meats.length === 0
        ? ["BPN"]
        : pho.meats.filter(meat => meat !== "BPN");
}

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

    fromTable = new Table(fromTable.id);

    if (toTable.status === TableStatus.ACTIVE) {
        const data = { [fromTable.id]: fromTable, [toTableId]: toTable };
        syncServer(SYNC_TYPE.TABLE, data);
    }

    return toTable;
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