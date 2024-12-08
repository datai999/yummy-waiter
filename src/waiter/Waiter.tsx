import React, { useState } from 'react';

import { Box } from '@mui/material';

import { Categories } from '../my/my-constants';
import Header from './Header';
import OrderTake from './OrderTake';

export default function Waiter() {
    const [selectedTable, setSelectedTable] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(Categories.BEEF);
    const [refreshState, setRefreshState] = useState(true);

    const overideSetSelectedCategory = (category: Categories) => {
        setSelectedCategory(category);
        setRefreshState(!refreshState);
    }

    return (
        <>
            <Box sx={{ position: "sticky", top: 0, zIndex: 1, bgcolor: "background.paper" }}>
                <Header selectedTable={selectedTable} setSelectedTable={setSelectedTable}
                    selectedCategory={selectedCategory} setSelectedCategory={overideSetSelectedCategory} />
            </Box>
            <OrderTake selectedTable={selectedTable} setSelectedTable={setSelectedTable}
                selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}
                refreshState={refreshState} />
        </>
    );
}
