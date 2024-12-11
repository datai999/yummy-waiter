import React, { useEffect, useState } from 'react';

import Header from './table/Header';
import TableManagerment from './table/ManagementTable';
import Waiter from './waiter/Waiter';

export default function App() {
  const [isWaiter, setIsWaiter] = useState<Boolean>(false);
  const [table, orderTable] = useState("");

  useEffect(() => {
    if (table)
      setIsWaiter(true);
  }, [table]);

  return (
    <>
      {isWaiter
        ? (<Waiter setIsWaiter={setIsWaiter} table={table} setTable={orderTable} />)
        : (<> <Header />
          <TableManagerment orderTable={orderTable} /></>)}
    </>
    /**
     * kitchen: select part of bill, print bill & system change status to waiter
     * chicken: update number of chicken meats to waiter
     */
  );
}
