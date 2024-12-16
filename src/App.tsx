import React, { useEffect, useState } from 'react';

import Header from './table/Header';
import TableManagerment from './table/ManagementTable';
import Waiter from './waiter/Waiter';
import { Box } from '@mui/material';
import { Table } from 'myTable';
import { generateTables } from './my/my-service';

export default function App() {
  const [isWaiter, setIsWaiter] = useState<Boolean>(false);
  const [tables, setTables] = useState<Table[]>(generateTables());
  const [table, orderTable] = useState<Table | null>(null);

  useEffect(() => {
    if (table)
      setIsWaiter(true);
  }, [table]);

  return (
    <>
      {isWaiter
        ? (<Waiter setIsWaiter={setIsWaiter} table={table!} orderTable={orderTable} />)
        : (<>
          <Box sx={{ position: "sticky", top: 0, zIndex: 1, bgcolor: "background.paper" }}>
            <Header />
          </Box>
          <TableManagerment tables={tables} setTables={setTables} orderTable={orderTable} /></>)}
    </>
    /**
     * kitchen: select part of bill, print bill & system change status to waiter
     * chicken: update number of chicken meats to waiter
     */
  );
}
