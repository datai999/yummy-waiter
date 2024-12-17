import React, { useState } from 'react';

import { Box } from '@mui/material';

import { Categories } from '../my/my-constants';
import Header from './HeaderWaiter';
import OrderTake from './TakeOrder';
import { Table } from 'myTable';

interface WaiterProps {
    setIsWaiter: (isWaiter: boolean) => void,
    table: Table,
    orderTable: (table: Table | null) => void,
    // Other props...
}

export interface ChildWaiterProps extends WaiterProps {
    category: Categories,
    setCategory: (category: Categories) => void
}

export default function Waiter(props: WaiterProps) {
    const [category, setCategory] = useState(Categories.BEEF);
    const [refreshState, setRefreshState] = useState(true);

    const setRefreshCategory = (category: Categories) => {
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
