import React, { useState } from 'react';

import Box from '@mui/material/Box';

import { Categories } from '../my-constants';
import Header from './Header';
import OrderTake from './OrderTake';

export default function Waiter() {
    const [selectedTable, setSelectedTable] = useState("");
    const [selectedCategory, setSelectedCategory] = React.useState(Categories.BEEF);

    return (
        <>
            <Box sx={{ position: "sticky", top: 0, zIndex: 1, bgcolor: "background.paper" }}>
                <Header selectedTable={selectedTable} setSelectedTable={setSelectedTable} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
            </Box>
            <OrderTake selectedTable={selectedTable} setSelectedTable={setSelectedTable} selectedCategory={selectedCategory} />
        </>
    );
}
