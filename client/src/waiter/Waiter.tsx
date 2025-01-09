import React, { useContext, useEffect, useRef, useState } from 'react';

import { Box } from '@mui/material';

import Header from './HeaderWaiter';
import OrderTake from './TakeOrder';
import { CategoryItem, Table, TrackedNonPho, TrackedPho } from '../my/my-class';
import { MENU, TableStatus } from '../my/my-constants';
import Footer from './FooterWaiter';
import _ from 'lodash';
import { AuthContext, TableContext } from '../App';
import { syncServer, SYNC_TYPE } from '../my/my-ws';

interface WaiterProps {
    tables: Map<String, Table>,
    tempBags: null | Map<number, Map<string, CategoryItem>>
}

export interface ChildWaiterProps extends WaiterProps {
    category: string,
    setCategory: (category: string) => void
}

export default function Waiter(props: WaiterProps) {
    const { auth, logout } = useContext(AuthContext);
    const [refresh, setRefresh] = useState(false);
    const { table, prepareChangeTable } = useContext(TableContext);
    const [category, setCategory] = useState(Object.keys(MENU)[0]);

    const bags = useRef(_.cloneDeep(props.tempBags || table.bags)).current;

    const addTogoBag = () => {
        const newBag = table.newBag();
        newBag.forEach(categoryItem => {
            categoryItem.pho.push(new TrackedPho(auth));
            categoryItem.nonPho.push(new TrackedNonPho(auth));
        });
        bags.set(bags.size, newBag);
        setRefresh(!refresh);
    }

    const submitOrder = () => {
        if (table.status === TableStatus.AVAILABLE) {
            table.status = TableStatus.ACTIVE;
            table.orderTime = new Date();
        }
        bags.forEach(bag => bag.forEach(categoryItem => {
            const lastPho = categoryItem.pho.pop()!;
            if (lastPho.items.size > 0) {
                lastPho.time = new Date();
                categoryItem.pho.push(lastPho);
            }
            const lastNonPho = categoryItem.nonPho.pop()!;
            if (lastNonPho.items.size > 0) {
                lastNonPho.time = new Date();
                categoryItem.nonPho.push(lastNonPho);
            }
        }));
        table.bags = bags;
        syncServer(SYNC_TYPE.TABLE, { [table.id]: table });
    };

    const childProps: ChildWaiterProps = { ...props, category: category, setCategory: setCategory, }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column' }} minHeight='740px'>
            <Box sx={{ position: "sticky", top: 0, zIndex: 1, bgcolor: "background.paper" }}>
                <Header props={childProps} />
            </Box>
            <OrderTake bags={bags} props={childProps} />
            <Box sx={{ position: "sticky", bottom: 3, zIndex: 1, bgcolor: "background.paper", mt: 'auto' }}>
                {/* <Box sx={{ mt: 'auto', mb: 1 }}> */}
                <Footer addTogoBag={addTogoBag} changeTable={() => prepareChangeTable(bags)} submitOrder={submitOrder} />
            </Box>
        </Box>
    );
}
