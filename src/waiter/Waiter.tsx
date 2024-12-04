import React, { useState } from "react";
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import OrderTake from './OrderTake';
import Header from './Header';
import { Categories } from "../my-constants";

export default function Waiter() {
    const [selectedTable, setSelectedTable] = useState("");
    const [selectedCategory, setSelectedCategory] = React.useState(Categories.BEEF);

    return (
        <Container>
            <Box sx={{ position: "sticky", top: 0, zIndex: 1, bgcolor: "background.paper" }}>
                <Header selectedTable={selectedTable} setSelectedTable={setSelectedTable} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
            </Box>
            <OrderTake selectedTable={selectedTable} setSelectedTable={setSelectedTable} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
        </Container>
    );
}
