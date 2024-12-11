import React, {
  useEffect,
  useState,
} from 'react';

import { Table } from 'myTable';
import {
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
} from 'react-icons/fi';

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

const TableManagerment = ({ setTable }: { setTable: (table: string) => void }) => {
  const [tables, setTables] = useState<Table[]>(
    Array.from({ length: 21 }, (_, index) => ({
      id: String(index < 12 ? index + 1 : index < 20 ? index + 2 : 'TOGO'),
      status: Math.random() > 0.5 ? "active" : Math.random() > 0.5 ? "attention" : "available",
      orderTime: new Date(Date.now() - Math.floor(Math.random() * 3600000)),
      orders: [
        { item: "Pasta Carbonara", quantity: 2, notes: "Extra cheese" },
        { item: "Caesar Salad", quantity: 1, notes: "No croutons" }
      ]
    } as Table))
  );

  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [orderHistory, setOrderHistory] = useState<Table[]>([]);

  const handleMoveToHistory = (tableId: string) => {
    setTables(prevTables =>
      prevTables.map(table =>
        table.id === tableId
          ? { ...table, status: "available", orderTime: null }
          : table
      )
    );
    const movedTable = tables.find(table => table.id === tableId);
    setOrderHistory(prev => [movedTable, ...prev] as Table[]);
  };

  return (
    <Box sx={{ padding: "20px" }}>
      <Grid2 container spacing={3}>
        {tables.map(table => (
          <Grid2 key={table.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <CardTable table={table} doneTable={handleMoveToHistory} />
          </Grid2>
        ))}
      </Grid2>

      <Box sx={{ mt: 4 }}>
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
      </Box>

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
                {selectedTable.orders.map((order, index) => (
                  <Box key={index}>
                    <Typography variant="h6">{order.item}</Typography>
                    <Stack direction="row" spacing={1}>
                      <Chip label={`Qty: ${order.quantity}`} />
                      <Chip label={order.notes} variant="outlined" />
                    </Stack>
                  </Box>
                ))}
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