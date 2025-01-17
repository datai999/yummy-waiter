import React, {
  useEffect,
  useState,
} from 'react';

import {
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
} from 'react-icons/fi';
import _ from 'lodash';

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid2,
  Modal,
  Stack,
  Typography,
} from '@mui/material';
import { styled } from '@mui/system';
import CardTable from './CardTable';
import { TableStatus } from '../my/my-constants';
import { Table } from '../my/my-class';

const ModalContent = styled(Box)({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: "500px",
  backgroundColor: "#fff",
  borderRadius: "8px",
  padding: "20px",
  maxHeight: "80vh",
  overflowY: "auto"
});

const TableManagerment = (props: {
  tables: Map<String, Table>,
  orderTable: (table: Table) => void
}) => {

  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [orderHistory, setOrderHistory] = useState<Table[]>([]);

  const handleMoveToHistory = (tableId: string) => {
    const table = props.tables.get(tableId)!;
    const movedTable = { ...table };
    table.status = TableStatus.AVAILABLE;
    table.orderTime = null;
    setOrderHistory(prev => [movedTable, ...prev] as Table[]);
  };

  return (
    <Box sx={{ padding: "10px" }}>
      <Grid2 container spacing={2} columns={12}>
        {Array.from(props.tables.values()).map(table => (
          <Grid2 key={table.id} size={{ xs: 6, sm: 4, md: 3, lg: 3 }}>
            <CardTable table={table} orderTable={props.orderTable} doneTable={handleMoveToHistory} />
          </Grid2>
        ))}
      </Grid2>

      {/* <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Recent Orders
        </Typography>
        <Stack
          direction="row"
          spacing={2}
          sx={{ overflowX: "auto", pb: 2 }}
        >
          {orderHistory.map((order, index) => (
            <Card
              key={index}
              sx={{ minWidth: 200, flexShrink: 0 }}
            >
              <CardContent>
                <Typography>Table {order.id}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {order.orderTime?.toLocaleTimeString()}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Box> */}

      <Modal
        open={Boolean(selectedTable)}
        onClose={() => setSelectedTable(null)}
      >
        <ModalContent>
          {selectedTable && (
            <>
              <Typography variant="h5" gutterBottom>
                Table {selectedTable.id} Details
              </Typography>
              <Stack spacing={2}>
                {/* {selectedTable.orders.map((order, index) => (
                  <Box key={index}>
                    <Typography variant="h6">{order.item}</Typography>
                    <Stack direction="row" spacing={1}>
                      <Chip label={`Qty: ${order.quantity}`} />
                      <Chip label={order.notes} variant="outlined" />
                    </Stack>
                  </Box>
                ))} */}
              </Stack>
              <Button
                fullWidth
                variant="contained"
                onClick={() => setSelectedTable(null)}
                sx={{ mt: 3 }}
              >
                Close
              </Button>
            </>
          )}
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default TableManagerment;