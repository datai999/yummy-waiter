import React, { createContext, useEffect, useState, useRef } from 'react';

import Header from './table/Header';
import TableManagerment from './table/ManagementTable';
import Waiter from './waiter/Waiter';
import { Alert, Box, Slide, SlideProps, Snackbar } from '@mui/material';
import { changeTable, generateTables } from './my/my-service';
import initWsClient, { SYNC_TYPE, syncServer } from './my/my-ws';
import { Auth, CategoryItem, LockedTable, Order, Table } from './my/my-class';
import Login from './user/Login';
import { SCREEN, TableStatus } from './my/my-constants';
import { UTILS } from './my/my-util';
import OrderHistory from './order/OrderHistory';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import MenuSetting from './setting/MenuSetting';
import ServerManagement from './user/ServerManagement';
import CustomerView from './user/CustomerView';

interface IAuthContext {
  auth: any, logout: () => void
}
interface ITableContext {
  table: Table,
  order: Order,
  orderTable: (table: null | Table) => void,
  setOrder: (order: null | Table) => void,
  prepareChangeTable: (bags: Map<number, Map<string, CategoryItem>>) => void
}

interface IPho {
  combo: Object,
  meat: null | Object;
  noodle: string[],
  reference: Object
}

interface ICategory {
  pho: null | IPho,
  nonPho: Object[]
}

interface IMENU {
  BEEF: ICategory,
  CHICKEN: ICategory,
  DRINK: ICategory
}

interface IAppContex extends IAuthContext {
  MENU_CATEGORIES: string[], MENU: IMENU,
  ORDERS: Map<string, Order>,
  order: Order,
  setOrder: (order: null | Table) => void,
  isLockedOrder: boolean,
  lockedOrderActor?: string,
  prepareChangeTable: (bags: Map<number, Map<string, CategoryItem>>) => void
}

const LOCKED_TABLES = new Map<string, LockedTable>();

export const AuthContext = createContext<IAuthContext>({ auth: {}, logout: () => { } });
const LockedTableContext = createContext<(tableId: string) => string | undefined>(
  (tableId: string) => LOCKED_TABLES.get(tableId)?.server);
export const TableContext = createContext<ITableContext>({} as ITableContext);
const ToastContext = createContext((msg: string) => { });

export const CONTEXT = {
  Auth: AuthContext,
  LockedTable: LockedTableContext,
  Table: TableContext,
  Order: TableContext,
  Toast: ToastContext
}

const tables = generateTables();

export const APP_CONTEXT = createContext<IAppContex>({
  MENU_CATEGORIES: [], MENU: {} as IMENU,
  auth: {}, logout: () => { },
  ORDERS: tables,
  order: {} as Order,
  setOrder: (order: null | Table) => { },
  isLockedOrder: false,
  prepareChangeTable: (bags: Map<number, Map<string, CategoryItem>>) => { }
})

const trung = new Auth('Trung', '3');

let closeInitWsClient: undefined | (() => void);

export default function App() {
  const [auth, setAuth] = useState<null | Auth>(null);
  const [table, orderOrder] = useState<Table | null>(null);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [refresh2, setRefresh2] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const [screen, routeScreen] = useState<SCREEN>(SCREEN.DEFAULT);
  const [viewCashier, setViewCashier] = useState(false);

  const holdTable = useRef<Table | null>();
  const holdViewCashier = useRef<boolean>(false);
  const toasMsg = useRef<string>();
  const tempTable = useRef<Table | null>();
  const tempBags = useRef<null | Map<number, Map<string, CategoryItem>>>(null);

  useEffect(() => {
    closeInitWsClient = initWsClient(auth ? auth.name : "Client_" + Math.floor(Math.random() * 10),
      onSyncTables, onLockedTables, onDoneOrders);
    // onSetAuth(trung);
    // orderTable(tables.get('Table 21')!);
  }, []);

  useEffect(() => {
    holdTable.current = table;
  }, [table]);

  useEffect(() => {
    holdViewCashier.current = viewCashier;
  }, [viewCashier])

  const orderTable = (order: null | Order) => {
    orderOrder(order);
    setViewCashier(false);
    routeScreen(SCREEN.DEFAULT);
  }

  const onSyncTables = (senter: string, syncTables: Map<String, Table>) => {
    syncTables.forEach(syncTable => {
      tables.set(syncTable.id, syncTable);
    });
    if (!holdTable.current?.id) {
      setRefresh((cur: Boolean) => !cur);
    } else if (syncTables.has(holdTable.current.id)) {
      toasMsg.current = `${senter} just changed order ${holdTable.current.id}`;
      setOpen(true);
      if (!holdViewCashier.current) {
        orderTable(null);
      }
      else orderOrder(syncTables.get(holdTable.current.id)!);
    }
  }

  const onLockedTables = (senter: string, lockedTables: Map<string, LockedTable>) => {
    lockedTables.forEach((lockedTable, tableId) =>
      lockedTable.locked ? LOCKED_TABLES.set(tableId, lockedTable) : LOCKED_TABLES.delete(tableId));
    if (!holdTable.current?.id) {
      setRefresh2((cur: Boolean) => !cur);
    } else {
      const lockedTable = lockedTables.get(holdTable.current.id);
      if (lockedTable) {
        toasMsg.current = `${senter} ${lockedTable.locked ? 'is taking' : 'unlocked'} ${holdTable.current.id}`;
        setOpen(true);
        setRefresh2((cur: Boolean) => !cur);
      }
    }
  }

  const onDoneOrders = (senter: string, syncTables: Map<String, Table>) => {
    syncTables.forEach(syncTable => {
      if (syncTable.id.startsWith('Togo')) tables.delete(syncTable.id);
      else tables.set(syncTable.id, new Table(syncTable.id));
    });
    if (!holdTable.current?.id) {
      setRefresh2((cur: Boolean) => !cur);
    } else if (syncTables.has(holdTable.current.id)) {
      toasMsg.current = `${senter} done order ${holdTable.current.id}`;
      setOpen(true);
      setRefresh2((cur: Boolean) => !cur);
    }
  };

  const onSetAuth = (auth: Auth) => {
    if (closeInitWsClient) {
      closeInitWsClient();
      closeInitWsClient = initWsClient(auth.name, onSyncTables, onLockedTables, onDoneOrders, removeLockedTablesBy);
    }
    setAuth(auth);
  }

  const removeLockedTablesBy = (username: string) => {
    const wrongLocked = new Map<string, LockedTable>();
    LOCKED_TABLES.forEach((lockedTable, tableId) => {
      if (lockedTable.server !== username) return;
      lockedTable.locked = false;
      wrongLocked.set(tableId, lockedTable);
      LOCKED_TABLES.delete(tableId);
    });
    if (wrongLocked.size) {
      syncServer(SYNC_TYPE.LOCKED_TABLES, wrongLocked);
    }
  }

  const logout = () => {
    if (closeInitWsClient) {
      closeInitWsClient();
      closeInitWsClient = initWsClient("Client_" + Math.floor(Math.random() * 10), onSyncTables, onLockedTables, onDoneOrders);
    }
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
      changeTable(auth, tables, tempTable.current, selectedTable.id);
      tempTable.current = null;
    } else tempBags.current = null;
    orderTable(selectedTable);
  }

  const newTogo = () => {
    const newTogo = new Table('Togo_' + UTILS.formatTime());
    orderTable(newTogo);
  }

  if (!auth) return (<Login setAuth={onSetAuth} />);

  const MENU = JSON.parse(localStorage.getItem('menu')!);

  const appContext = {
    MENU_CATEGORIES: Object.keys(MENU), MENU,
    auth, logout,
    ORDERS: tables,
    order: table || {} as Table, setOrder: orderTable,
    isLockedOrder: Boolean(table?.id && LOCKED_TABLES.get(table.id)?.server && LOCKED_TABLES.get(table.id)?.server !== auth.name),
    lockedOrderActor: LOCKED_TABLES.get(table?.id || '')?.server,
    prepareChangeTable
  };

  if (auth.code === '') {
    return (
      <APP_CONTEXT.Provider value={appContext}>
        <CustomerView back={logout} />
      </APP_CONTEXT.Provider>)
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <APP_CONTEXT.Provider value={appContext}>
        <ToastContext.Provider value={(msg: string) => { toasMsg.current = msg; setOpen(true) }}>
          <AuthContext.Provider value={{ auth, logout }}>
            <LockedTableContext.Provider value={(tableId: string) => LOCKED_TABLES.get(tableId)?.server}>
              {screen === SCREEN.DEFAULT && (table
                ? (<TableContext.Provider value={{ table, order: table, orderTable, setOrder: orderTable, prepareChangeTable }}>
                  <Waiter tables={tables} tempBags={tempBags.current} viewCashier={viewCashier} setViewCashier={setViewCashier} />
                </TableContext.Provider>
                ) : (<>
                  <Box sx={{ position: "sticky", top: 0, zIndex: 1, bgcolor: "background.paper" }}>
                    <Header routeScreen={routeScreen} newTogo={newTogo} />
                  </Box>
                  <TableManagerment tables={tables} orderTable={orderOrChangeTable} />
                </>))}
              {screen === SCREEN.SERVER && <ServerManagement back={() => routeScreen(SCREEN.DEFAULT)} />}
              {screen === SCREEN.MENU && <MenuSetting back={() => routeScreen(SCREEN.DEFAULT)} />}
              {screen === SCREEN.HISTORY_ORDER && <OrderHistory back={() => routeScreen(SCREEN.DEFAULT)} />}
            </LockedTableContext.Provider>
            <Snackbar
              open={open}
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
              onClose={() => setOpen(false)}
              autoHideDuration={5000}
              TransitionComponent={(props: SlideProps) => <Slide {...props} direction="down" />}
            // message={`${toasMsg.current}`}
            // action={action}
            >
              <Alert
                onClose={() => setOpen(false)}
                severity="info"
                color='error'
                variant="filled"
                sx={{ width: '100%' }}
              >
                {`${toasMsg.current}`}
              </Alert>
            </Snackbar>
          </AuthContext.Provider>
        </ToastContext.Provider>
      </APP_CONTEXT.Provider>
    </LocalizationProvider>
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
     *  + lock/unlock only user serve table
     *  + store order data
     *  + table note
     *  + view order data
     *  + price
     *  + cashier
     *  - print
     *  + discount
     *  + UI for customer fill phone
     *  + edit menu
     *  + edit user
     *  - order history
     *  - waring cashier customer is viewing before cash
     *  + customer submit & gain reward: re-write receipt
     *  - cashier add phone to history order and take point for customer
     *  - cashier edit point
     *  - devices
     *  - config
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
