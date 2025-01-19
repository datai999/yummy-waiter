import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

import { Box } from '@mui/material';

import Header from './HeaderWaiter';
import OrderTake from './TakeOrder';
import { CategoryItem, LockedTable, Table, TrackedNonPho, TrackedPho } from '../my/my-class';
import { MENU, TableStatus } from '../my/my-constants';
import Footer from './FooterWaiter';
import _ from 'lodash';
import { CONTEXT } from '../App';
import { syncServer, SYNC_TYPE } from '../my/my-ws';
import TakeCustomerInfo from './TakeCustomerInfo';

interface WaiterProps {
    tables: Map<String, Table>,
    tempBags: null | Map<number, Map<string, CategoryItem>>
}

export interface ChildWaiterProps extends WaiterProps {
    category: string,
    setCategory: (category: string) => void
}

export const WAITER_CONTEXT = {
    lockOrder: createContext({ locked: false, setLocked: (locked: boolean) => { } })
}

export default function Waiter(props: WaiterProps) {
    const { auth, logout } = useContext(CONTEXT.Auth);
    const [refresh, setRefresh] = useState(false);
    const { table, orderTable, prepareChangeTable } = useContext(CONTEXT.Table);
    const [category, setCategory] = useState(Object.keys(MENU)[0]);
    const [openModal, setOpenModal] = useState(false);
    const [note, setNote] = useState<string>(_.cloneDeep(table.note || ''));
    const [locked, setLocked] = useState(false);

    let refBags = useRef(_.cloneDeep(props.tempBags || table.bags));
    const bags = refBags.current;

    const addTogoBag = () => {
        const newBag = table.newBag();
        newBag.forEach(categoryItem => {
            categoryItem.pho.push(new TrackedPho(auth));
            categoryItem.nonPho.push(new TrackedNonPho(auth));
        });
        bags.set(bags.size, newBag);
        setRefresh(!refresh);
    }

    const onSetLocked = (nextLocked: boolean) => {
        setLocked(nextLocked);
        syncServer(SYNC_TYPE.LOCKED_TABLES, { [table.id]: new LockedTable(true, auth.name) });
    }

    const submitOrder = () => {
        let bagChange = false;
        if (note !== (table.note || '')) {
            bagChange = true;
            table.note = note;
        }
        let count = 0;
        bags.forEach((categoryItems, key) => {
            let hasItem = false;
            categoryItems.forEach(categoryItem => {
                const lastPho = categoryItem.pho.pop()!;
                if (lastPho.items.size > 0) {
                    bagChange = true;
                    lastPho.time = new Date();
                    categoryItem.pho.push(lastPho);
                }
                const lastNonPho = categoryItem.nonPho.pop()!;
                if (lastNonPho.items.size > 0) {
                    bagChange = true;
                    lastNonPho.time = new Date();
                    categoryItem.nonPho.push(lastNonPho);
                }
                if (categoryItem.pho.length > 0 || categoryItem.nonPho.length > 0)
                    hasItem = true;
            });
            if (!hasItem) bags.delete(Number(key));
            else table.bags.set(count++, categoryItems);
        });
        syncServer(SYNC_TYPE.LOCKED_TABLES, { [table.id]: new LockedTable(false, auth.name) });
        if (bagChange) {
            if (table.status === TableStatus.AVAILABLE) {
                table.status = TableStatus.ACTIVE;
                table.orderTime = new Date();
            }
            props.tables.set(table.id, table);
            syncServer(SYNC_TYPE.ACTIVE_TABLES, { [table.id]: table });
        }
    };

    const takeCustomerInfo = () => {
        syncServer(SYNC_TYPE.LOCKED_TABLES, { [table.id]: new LockedTable(true, auth.name) });
        setOpenModal(true)
    }

    const doneTakeCustomerInfo = () => {
        syncServer(SYNC_TYPE.LOCKED_TABLES, { [table.id]: new LockedTable(false, auth.name) });
        setOpenModal(false)
    }

    const doneOrder = () => {
        table.cleanTime = new Date();
        table.cashier = auth.name;
        if (table.id.startsWith('Togo')) props.tables.delete(table.id);
        else props.tables.set(table.id, new Table(table.id));
        syncServer(SYNC_TYPE.DONE_ORDER, { [table.id]: table });
        orderTable(null);
    }

    const childProps: ChildWaiterProps = { ...props, category: category, setCategory: setCategory, }

    return (
        <WAITER_CONTEXT.lockOrder.Provider value={{ locked: locked, setLocked: onSetLocked }} >
            <Box sx={{ display: 'flex', flexDirection: 'column' }} minHeight='96vh'>
                <Box sx={{ position: "sticky", top: 0, zIndex: 1, bgcolor: "background.paper" }}>
                    <Header props={childProps} />
                </Box>
                <OrderTake note={note} setNote={setNote} bags={bags} props={childProps} />
                <Box sx={{ position: "sticky", bottom: 5, zIndex: 1, bgcolor: "background.paper", mt: 'auto' }}>
                    {/* <Box sx={{ mt: 'auto', mb: 1 }}> */}
                    <Footer addTogoBag={addTogoBag} changeTable={() => prepareChangeTable(bags)} submitOrder={submitOrder} customerInfo={takeCustomerInfo} doneOrder={doneOrder} />
                </Box>
                <TakeCustomerInfo openModal={openModal} closeModel={doneTakeCustomerInfo} />
            </Box>
        </WAITER_CONTEXT.lockOrder.Provider >
    );
}
