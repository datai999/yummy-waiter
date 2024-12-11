import React, { useState } from 'react';

import { Box } from '@mui/material';

import { Categories } from '../my/my-constants';
import Header from './HeaderWaiter';
import OrderTake from './TakeOrder';

export default function Waiter({ setIsWaiter, table, setTable }: {
    setIsWaiter: (isWaiter: boolean) => void,
    table: string,
    setTable: (table: string) => void,
}) {
    const [selectedCategory, setSelectedCategory] = useState(Categories.BEEF);
    const [refreshState, setRefreshState] = useState(true);

    const overideSetSelectedCategory = (category: Categories) => {
        setSelectedCategory(category);
        setRefreshState(!refreshState);
    }

    return (
        <>
            <Box sx={{ position: "sticky", top: 0, zIndex: 1, bgcolor: "background.paper" }}>
                <Header setIsWaiter={setIsWaiter} selectedTable={table} setSelectedTable={setTable}
                    selectedCategory={selectedCategory} setSelectedCategory={overideSetSelectedCategory} />
            </Box>
            <OrderTake selectedTable={table} setSelectedTable={setTable}
                selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}
                refreshState={refreshState} />
        </>
    );
}
