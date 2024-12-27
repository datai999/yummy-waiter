import React, { useEffect, useState } from 'react';

import Header from './table/Header';
import TableManagerment from './table/ManagementTable';
import Waiter from './waiter/Waiter';
import { Box } from '@mui/material';
import { generateTables } from './my/my-service';
import initWsClient from './my/my-ws';
import { Table } from './my/my-class';

export default function App() {
  const [isWaiter, setIsWaiter] = useState<Boolean>(false);
  const [tables, setTables] = useState<Map<String, Table>>(generateTables);
  const [table, orderTable] = useState<Table | null>(null);
  const [refresh, setRefresh] = useState<Boolean>(false);

  useEffect(() => {
    return initWsClient("Client_" + Math.floor(Math.random() * 10), onSyncTables);
  }, []);

  useEffect(() => {
    if (table)
      setIsWaiter(true);
  }, [table]);

  const onSyncTables = (syncTables: Map<String, Table>) => {
    syncTables.forEach(syncTable => {
      tables.set(syncTable.id, syncTable);
    });
    if (!isWaiter) {
      setRefresh((cur: Boolean) => !cur);
    }
  }

  // TODO: consider remove isWaiter
  const overideOrderTable = (nextTable: Table | null) => {
    setIsWaiter(true);
    orderTable(nextTable);
  }

  return (
    <>
      {isWaiter && table
        ? (<Waiter setIsWaiter={setIsWaiter} tables={tables} table={table!} orderTable={overideOrderTable} />)
        : (<>
          <Box sx={{ position: "sticky", top: 0, zIndex: 1, bgcolor: "background.paper" }}>
            <Header />
          </Box>
          <TableManagerment tables={tables} orderTable={overideOrderTable} /></>)}
    </>
    /**
     * waiter: 
     *  + communicate between devices in LAN
     *  + remove confirmation
     *  + recommendation pho
     *  - qty btn pho
     *  - count pho
     *  - multi item selection to edit
     *  - button edit all items
     *  - UI line by line
     *  - order history
     *  - user login
     *  - user manager
     *  - action by
     *  - void after 5min must accept by manager
     * kitchen: select part of bill, print bill & system change status to waiter
     * chicken: update number of chicken meats to waiter
     * 
     * communicate web app - desktop app:
     *  - chrome extension read from local storage or cookie -> run bat
     *  - turn web app to desktop app: effort -> x
     *  + embedded browser to desktop app : electronjs, expo -> electronjs
     *  - custom uri: only Internet Explorer -> x
     * -> electronjs
     */
  );
}
