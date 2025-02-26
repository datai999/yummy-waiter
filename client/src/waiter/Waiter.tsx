import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

import { Box } from '@mui/material';

import Header from './HeaderWaiter';
import OrderTake from './TakeOrder';
import { CategoryItem, LockedTable, Receipt, Table, TrackedNonPho, TrackedPho } from '../my/my-class';
import { TableStatus } from '../my/my-constants';
import Footer from './FooterWaiter';
import _ from 'lodash';
import { APP_CONTEXT, CONTEXT } from '../App';
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
    const { MENU_CATEGORIES, auth, order, setOrder, prepareChangeTable } = useContext(APP_CONTEXT);
    const [refresh, setRefresh] = useState(false);
    const [category, setCategory] = useState(MENU_CATEGORIES[0]);
    const [openModal, setOpenModal] = useState(false);
    const [note, setNote] = useState<string>(_.cloneDeep(order.note || ''));
    const [viewCashier, setViewCashier] = useState(false);

    const locked = useRef(Boolean(useContext(CONTEXT.LockedTable)(order.id)) === auth.name);

    let refBags = useRef(_.cloneDeep(props.tempBags || order.bags));
    const bags = refBags.current;

    const addTogoBag = () => {
        const newBag = order.newBag();
        newBag.forEach(categoryItem => {
            categoryItem.pho.push(new TrackedPho(auth));
            categoryItem.nonPho.push(new TrackedNonPho(auth));
        });
        bags.set(bags.size, newBag);
        setRefresh(!refresh);
    }

    const onSetLocked = (nextLocked: boolean) => {
        if (!locked.current)
            syncServer(SYNC_TYPE.LOCKED_TABLES, { [order.id]: new LockedTable(true, auth.name) });
        locked.current = nextLocked;
    }

    const submitOrder = () => {
        let bagChange = false;
        if (note !== (order.note || '')) {
            bagChange = true;
            order.note = note;
        }
        const cleanBags = SERVICE.cleanBags(bags);
        if (!bagChange) bagChange = cleanBags.bagChange;
        if (cleanBags.cleanBags.size !== 0)
            order.bags = cleanBags.cleanBags;
        syncServer(SYNC_TYPE.LOCKED_TABLES, { [order.id]: new LockedTable(false, auth.name) });
        if (bagChange) {
            if (order.status === TableStatus.AVAILABLE) {
                order.status = TableStatus.ACTIVE;
                order.orderTime = new Date();
            }
            props.tables.set(order.id, order);
            syncServer(SYNC_TYPE.ACTIVE_TABLES, { [order.id]: order });
        }
    };

    const takeCustomerInfo = () => {
        syncServer(SYNC_TYPE.LOCKED_TABLES, { [order.id]: new LockedTable(true, auth.name) });
        setOpenModal(true)
    }

    const doneTakeCustomerInfo = () => {
        syncServer(SYNC_TYPE.LOCKED_TABLES, { [order.id]: new LockedTable(false, auth.name) });
        setOpenModal(false)
    }

    const openCashier = () => {
        syncServer(SYNC_TYPE.LOCKED_TABLES, { [order.id]: new LockedTable(true, auth.name) });
        syncServer(SYNC_TYPE.ON_CASHIER, { cashier: auth.name });
        setViewCashier(true);
    }

    const doneOrder = () => {
        order.cleanTime = new Date();
        order.status = TableStatus.DONE;
        if (order.id.startsWith('Togo')) props.tables.delete(order.id);
        else props.tables.set(order.id, new Table(order.id));
        syncServer(SYNC_TYPE.DONE_ORDER, { [order.id]: order });
        setOrder(null);
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
            <Cashier view={viewCashier} close={() => setViewCashier(false)} orders={props.tables} note={note} bags={bags}
                receipt={new Receipt(auth.name, order, note).calculateTotal(bags)} />
        </WAITER_CONTEXT.lockOrder.Provider >
    );
}
