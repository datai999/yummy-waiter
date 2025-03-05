import {
    BEEF_MEAT,
    TableStatus,
} from './my-constants';
import _ from 'lodash';
import { syncServer, SYNC_TYPE } from './my-ws';
import { CategoryItem, LockedTable, Pho, Table } from './my-class';
import { UTILS } from './my-util';

const lodash = _;

export const generateId = () => UTILS.formatTime();

export const sortBeefMeat = (a: string, b: string) =>
    BEEF_MEAT[a as keyof typeof BEEF_MEAT]?.sort
    - BEEF_MEAT[b as keyof typeof BEEF_MEAT]?.sort;

export const generateTables = () =>
    new Map(Array.from({ length: 20 }, (_, index) => {
        const id = String(index > 19 ? 'TOGO ' + (index - 19) : 'Table ' + (index < 12 ? index + 1 : index + 2));
        return [id, new Table(id)]
    }));

export const completePho = (category: any, pho: Pho) => {
    pho.id = pho.id.length > 0 ? pho.id : generateId();
    const MEAT = category.pho.meat;
    const REFER = category.pho.reference;

    if (pho.meats.length === 0) pho.code = 'BPN';
    else if (pho.meats.length === 6) pho.code = 'DB';
    else pho.code = MEAT ? pho.meats.map(meat => MEAT[meat as keyof typeof MEAT]?.code || meat).join('')
        : category.pho.combo[pho.combo as keyof typeof Object][0]['code'];

    if (pho.combo && pho.combo.startsWith('#8b')) pho.noodle = 'Bread'
    else if (pho.combo && pho.combo.startsWith('#8c')) pho.noodle = 'Mì'

    pho.referCode = (pho.preferences || [])
        .map(refer => REFER[refer as keyof typeof REFER])
        .sort((a, b) => a.sort - b.sort)
        .map(refer => refer.code)
        .join(',');

    if (category.pho.meat) pho.price = 12.99;
    else if (pho.combo) {
        pho.price = category.pho.combo[pho.combo as keyof typeof Object][0].price;
    }
    if (pho.code === 'BPN') {
        pho.price = pho.noodle === 'Cơm' ? 5 : 7;
    }
}

export const changeTable = (auth: any, tables: Map<String, Table>, fromTable: Table, toTableId: string): Table | null => {
    if (fromTable.id === toTableId) return fromTable;
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
    tables.set(fromTable.id, fromTable);

    syncServer(SYNC_TYPE.LOCKED_TABLES, {
        [fromTable.id]: new LockedTable(false, auth.name),
        [toTableId]: new LockedTable(true, auth.name)
    });
    if (toTable.status === TableStatus.ACTIVE) {
        const data = { [fromTable.id]: fromTable, [toTableId]: toTable };
        syncServer(SYNC_TYPE.ACTIVE_TABLES, data);
    }

    return toTable;
}

const cleanBags = (bags: Map<number, Map<string, CategoryItem>>) => {
    let bagChange = false;
    let count = 0;
    const cleanBags = new Map<number, Map<string, CategoryItem>>();
    bags.forEach((categoryItems, key) => {
        let hasItem = false;
        categoryItems.forEach(categoryItem => {
            const lastPho = categoryItem.pho.pop()!;
            if (lastPho && lastPho.items.size > 0) {
                bagChange = true;
                lastPho.time = new Date();
                categoryItem.pho.push(lastPho);
            }
            const lastNonPho = categoryItem.nonPho.pop()!;
            if (lastNonPho && lastNonPho.items.size > 0) {
                bagChange = true;
                lastNonPho.time = new Date();
                categoryItem.nonPho.push(lastNonPho);
            }
            if (categoryItem.pho.length > 0 || categoryItem.nonPho.length > 0)
                hasItem = true;
        });
        if (!hasItem) bags.delete(Number(key));
        else cleanBags.set(count++, categoryItems);
    });
    return { bagChange, cleanBags };
}

export const SERVICE = {
    cleanBags
}