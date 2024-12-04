import * as React from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import OrderTake from './waiter/OrderTake';
import Header from './Header';
import { Categories } from "./constants";

export default function App() {
  const [selectedCategory, setSelectedCategory] = React.useState(Categories.BEEF);

  return (
    <Container>
      <Box sx={{ position: "sticky", top: 0, zIndex: 1, bgcolor: "background.paper" }}>
        <Header selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
      </Box>
      <OrderTake selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
    </Container>
  );
}
