import {
    BEEF_MEAT,
    TableStatus,
} from './my-constants';
import _ from 'lodash';
import { syncServer, SYNC_TYPE } from './my-ws';
import { LockedTable, Pho, Table } from './my-class';

const lodash = _;

export const generateId = () => {
    const date = new Date();
    return date.toLocaleString("en-US", { timeZone: 'PST', hour12: false, dateStyle: 'short', timeStyle: 'medium' })
        + " " + date.getMilliseconds();
}

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
    const MEAT = category.pho.meat || {};
    const REFER = category.pho.reference;

    if (pho.meats.length === 0) pho.code = 'BPN';
    else if (pho.meats.length === 6) pho.code = 'DB';
    else pho.code = pho.meats.map(meat => MEAT[meat as keyof typeof MEAT]?.code || meat).join('');

    if (pho.combo && pho.combo.startsWith('#8b')) pho.noodle = 'Bread'
    else if (pho.combo && pho.combo.startsWith('#8c')) pho.noodle = 'Mì'

    pho.referCode = (pho.preferences || [])
        .map(refer => REFER[refer as keyof typeof REFER])
        .sort((a, b) => a.sort - b.sort)
        .map(refer => refer.code)
        .join(',');
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