import React, { createContext, useEffect, useState } from 'react';

import Header from './table/Header';
import TableManagerment from './table/ManagementTable';
import Waiter from './waiter/Waiter';
import { Box } from '@mui/material';
import { changeTable, generateTables } from './my/my-service';
import initWsClient from './my/my-ws';
import { CategoryItem, LockedTable, Table } from './my/my-class';
import Login from './user/Login';
import { TableStatus } from './my/my-constants';

interface IAuthContext {
  auth: any, logout: () => void
}
interface ITableContext {
  table: Table,
  orderTable: (table: null | Table) => void,
  prepareChangeTable: (bags: Map<number, Map<string, CategoryItem>>) => void
}

const LOCKED_TABLES = new Map<string, LockedTable>();

export const AuthContext = createContext<IAuthContext>({ auth: {}, logout: () => { } });
const LockedTableContext = createContext<(tableId: string) => string | undefined>(
  (tableId: string) => LOCKED_TABLES.get(tableId)?.server);
export const TableContext = createContext<ITableContext>({} as ITableContext);

export const CONTEXT = {
  Auth: AuthContext,
  LockedTable: LockedTableContext,
  Table: TableContext
}

const tables = generateTables();

const Tai = { name: "Tai", code: 0, permission: [] };

export default function App() {
  const [auth, setAuth] = useState<any>(Tai);
  const [table, orderTable] = useState<Table | null>(null);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [refresh2, setRefresh2] = useState<boolean>(false);

  const tempTable = React.useRef<Table | null>();
  const tempBags = React.useRef<null | Map<number, Map<string, CategoryItem>>>(null);

  useEffect(() => {
    initWsClient("Client_" + Math.floor(Math.random() * 10), onSyncTables, onLockedTables);
    // orderTable(tables.get('Table 12')!);
  }, []);

  const onSyncTables = (syncTables: Map<String, Table>) => {
    syncTables.forEach(syncTable => {
      tables.set(syncTable.id, syncTable);
    });
    if (!table) {
      setRefresh((cur: Boolean) => !cur);
    }
  }

  const onLockedTables = (lockedTables: Map<string, LockedTable>) => {
    lockedTables.forEach((lockedTable, tableId) =>
      lockedTable.locked ? LOCKED_TABLES.set(tableId, lockedTable) : LOCKED_TABLES.delete(tableId));
    if (!table) {
      setRefresh2((cur: Boolean) => !cur);
    }
  }

  const logout = () => {
    orderTable(null);
    setAuth(null);
  }

  const prepareChangeTable = (bags: Map<number, Map<string, CategoryItem>>) => {
    tempTable.current = table;
    tempBags.current = bags;
    orderTable(null);
  }

  const orderOrChangeTable = (selectedTable: Table) => {
    if (tempTable.current && selectedTable.status === TableStatus.ACTIVE) {
      alert("This table is being ordered by another waiter.");
      return;
    }
    if (tempTable.current) {
      changeTable(tables, tempTable.current, selectedTable.id);
      tempTable.current = null;
    } else tempBags.current = null;
    orderTable(selectedTable);
  }

  const newTogo = () => {
    const current = new Date();
    const newTogo = new Table('Togo_' + current.toLocaleDateString('en-US', { day: 'numeric', month: 'numeric', year: 'numeric' })
      + '_' + current.toLocaleTimeString('en-US', { hour12: false }));
    tables.set(newTogo.id, newTogo);
    orderTable(newTogo);
  }

  if (!auth) return (<Login setAuth={setAuth} />)

  return (<AuthContext.Provider value={{ auth, logout }}>
    <LockedTableContext.Provider value={React.useContext(CONTEXT.LockedTable)}>
      {table
        ? (<TableContext.Provider value={{ table, orderTable, prepareChangeTable }}>
          <Waiter tables={tables} tempBags={tempBags.current} />
        </TableContext.Provider>
        )
        : (<>
          <Box sx={{ position: "sticky", top: 0, zIndex: 1, bgcolor: "background.paper" }}>
            <Header newTogo={newTogo} />
          </Box>
          <TableManagerment tables={tables} orderTable={orderOrChangeTable} />
        </>)}
    </LockedTableContext.Provider>
  </AuthContext.Provider>
    /**
     * waiter: 
     *  + communicate between devices in LAN
     *  + remove confirmation
     *  + recommendation pho
     *  + order detail sperate by times modify (time + acter)
     *  + UI like aldelo
     *  + expend dine-in vs togo
     *  + add new table togo
     *  + UI only togo
     *  + void
     *  + order history
     *  + select table by UI
     *  + qty btn pho
     *  + count pho
     *  + user login
     *  + scroll view order detail
     *  + check order change?
     *  + UI table: server, Badge by special item
     *  - lock/unlock only user serve table
     *  - store order data
     *  - view order data
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
