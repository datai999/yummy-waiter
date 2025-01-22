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
import Cashier from '../user/Cashier';
import { SERVICE } from '../my/my-service';

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
    const [viewCashier, setViewCashier] = useState(false);

    const locked = useRef(Boolean(useContext(CONTEXT.LockedTable)(table.id)) === auth.name);

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
        if (!locked.current)
            syncServer(SYNC_TYPE.LOCKED_TABLES, { [table.id]: new LockedTable(true, auth.name) });
        locked.current = nextLocked;
    }

    const submitOrder = () => {
        let bagChange = false;
        if (note !== (table.note || '')) {
            bagChange = true;
            table.note = note;
        }
        const cleanBags = SERVICE.cleanBags(bags);
        if (!bagChange) bagChange = cleanBags.bagChange;
        if (cleanBags.cleanBags.size !== 0)
            table.bags = cleanBags.cleanBags;
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

    const openCashier = () => {
        syncServer(SYNC_TYPE.LOCKED_TABLES, { [table.id]: new LockedTable(true, auth.name) });
        setViewCashier(true);
    }

    const doneOrder = () => {
        table.cleanTime = new Date();
        table.status = TableStatus.DONE;
        if (table.id.startsWith('Togo')) props.tables.delete(table.id);
        else props.tables.set(table.id, new Table(table.id));
        syncServer(SYNC_TYPE.DONE_ORDER, { [table.id]: table });
        orderTable(null);
    }

    const childProps: ChildWaiterProps = { ...props, category: category, setCategory: setCategory, }

    return (
        <WAITER_CONTEXT.lockOrder.Provider value={{ locked: locked.current, setLocked: onSetLocked }} >
            <Box sx={{ display: 'flex', flexDirection: 'column' }} minHeight='96vh'>
                <Box sx={{ position: "sticky", top: 0, zIndex: 1, bgcolor: "background.paper" }}>
                    <Header props={childProps} />
                </Box>
                <OrderTake note={note} setNote={setNote} bags={bags} props={childProps} />
                <Box sx={{ position: "sticky", bottom: 3, zIndex: 1, bgcolor: "background.paper", mt: 'auto' }}>
                    {/* <Box sx={{ mt: 'auto', mb: 1 }}> */}
                    <Footer addTogoBag={addTogoBag} changeTable={() => prepareChangeTable(bags)} submitOrder={submitOrder} customerInfo={takeCustomerInfo} openCashier={openCashier} doneOrder={doneOrder} />
                </Box>
            </Box>
            <TakeCustomerInfo openModal={openModal} closeModel={doneTakeCustomerInfo} />
            <Cashier view={viewCashier} close={() => setViewCashier(false)} orders={props.tables} note={note} bags={bags} />
        </WAITER_CONTEXT.lockOrder.Provider >
    );
}
