import React, { useEffect, useState } from 'react';

import Header from './table/Header';
import TableManagerment from './table/ManagementTable';
import Waiter from './waiter/Waiter';
import { Box } from '@mui/material';
import { Table } from 'myTable';
import { generateTables } from './my/my-service';
import initWsClient from './my/my-ws';

export default function App() {
  const [isWaiter, setIsWaiter] = useState<Boolean>(false);
  const [tables, setTables] = useState<Table[]>(generateTables());
  const [table, orderTable] = useState<Table | null>(null);

  useEffect(() => {
    return initWsClient("Client_" + Math.floor(Math.random() * 10));
  }, []);

  useEffect(() => {
    if (table)
      setIsWaiter(true);
  }, [table]);

  return (
    <>
      {isWaiter
        ? (<Waiter setIsWaiter={setIsWaiter} tables={tables} table={table!} orderTable={orderTable} />)
        : (<>
          <Box sx={{ position: "sticky", top: 0, zIndex: 1, bgcolor: "background.paper" }}>
            <Header />
          </Box>
          <TableManagerment tables={tables} setTables={setTables} orderTable={orderTable} /></>)}
    </>
    /**
     * waiter: 
     *  - communicate between devices in LAN
     *  - remove confirmation
     *  - multi item selection to edit
     *  - button edit all items
     *  - UI line by line
     * kitchen: select part of bill, print bill & system change status to waiter
     * chicken: update number of chicken meats to waiter
     * 
     * communicate web app - desktop app:
     *  - chrome extension read from local storage or cookie -> run bat
     *  - turn web app to desktop app: effort -> x
     *  - embedded browser to desktop app : electronjs, expo -> electronjs
     *  - custom uri: only Internet Explorer -> x
     * -> electronjs
     */
  );
}
