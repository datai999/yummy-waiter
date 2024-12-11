import React, { useState } from 'react';

import Header from './table/Header';
import TableManagerment from './table/TableManagement';
import Waiter from './waiter/Waiter';

export default function App() {
  const [isWaiter, setIsWaiter] = useState<Boolean>(true);

  return (
    <>
      {isWaiter
        ? (<Waiter setIsWaiter={setIsWaiter} />)
        : (<> <Header />
          <TableManagerment /></>)}
    </>
    /**
     * kitchen: select part of bill, print bill & system change status to waiter
     * chicken: update number of chicken meats to waiter
     */
  );
}
