import React, { useState } from 'react';

import { Box } from '@mui/material';

import Header from './HeaderWaiter';
import OrderTake from './TakeOrder';
import { Table } from '../my/my-class';
import { MENU } from '../my/my-constants';

interface WaiterProps {
    setIsWaiter: (isWaiter: boolean) => void,
    tables: Map<String, Table>,
    table: Table,
    orderTable: (table: Table | null) => void,
}

export interface ChildWaiterProps extends WaiterProps {
    category: string,
    setCategory: (category: string) => void
}

export default function Waiter(props: WaiterProps) {
    const [category, setCategory] = useState(Object.keys(MENU)[0]);
    const [refreshState, setRefreshState] = useState(true);

    const setRefreshCategory = (category: string) => {
        setCategory(category);
        setRefreshState(!refreshState);
    }

    const childProps: ChildWaiterProps = { ...props, category: category, setCategory: setCategory, }

    return (
        <>
            <Box sx={{ position: "sticky", top: 0, zIndex: 1, bgcolor: "background.paper" }}>
                <Header props={{ ...childProps, setCategory: setRefreshCategory }} />
            </Box>
            <OrderTake props={{ ...childProps, refreshState: refreshState }} />
        </>
    );
}
