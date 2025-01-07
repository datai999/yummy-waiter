import React, { createContext, useEffect, useState } from 'react';

import Header from './table/Header';
import TableManagerment from './table/ManagementTable';
import Waiter from './waiter/Waiter';
import { Box } from '@mui/material';
import { generateTables } from './my/my-service';
import initWsClient from './my/my-ws';
import { Table } from './my/my-class';
import Login from './user/Login';

interface IAuthContext {
  auth: any, logout: () => void
}
interface ITableContext {
  table: Table, orderTable: (table: null | Table) => void
}

export const AuthContext = createContext<IAuthContext>({ auth: {}, logout: () => { } });
export const TableContext = createContext<ITableContext>({} as ITableContext);

const tables = generateTables();

const Tai = { name: "Tai", code: 0, permission: [] };

export default function App() {
  const [auth, setAuth] = useState<any>(Tai);
  const [table, orderTable] = useState<Table | null>(null);
  const [refresh, setRefresh] = useState<Boolean>(false);

  useEffect(() => {
    initWsClient("Client_" + Math.floor(Math.random() * 10), onSyncTables);
    orderTable(tables.get('Table 12')!);
  }, []);

  const onSyncTables = (syncTables: Map<String, Table>) => {
    syncTables.forEach(syncTable => {
      tables.set(syncTable.id, syncTable);
    });
    if (!table) {
      setRefresh((cur: Boolean) => !cur);
    }
  }

  const logout = () => {
    orderTable(null);
    setAuth(null);
  }

  if (!auth) return (<Login setAuth={setAuth} />)

  return (<AuthContext.Provider value={{ auth, logout }}>
    {table
      ? (<TableContext.Provider value={{ table, orderTable }}>
        <Waiter tables={tables} />
      </TableContext.Provider>
      )
      : (<>
        <Box sx={{ position: "sticky", top: 0, zIndex: 1, bgcolor: "background.paper" }}>
          <Header />
        </Box>
        <TableManagerment tables={tables} orderTable={orderTable} />
      </>)}

  </AuthContext.Provider>
    /**
     * waiter: 
     *  + communicate between devices in LAN
     *  + remove confirmation
     *  + recommendation pho
     *  + order detail sperate by times modify (time + acter)
     *  - UI like aldelo
     *  - order history
     *  - select table by UI
     *  + qty btn pho
     *  + count pho
     *  - multi item selection to edit
     *  - button edit all items
     *  + user login
     *  - user manager
     *  - action by
     *  - void after 5min must accept by manager
     *  - UI for customer fill phone
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
