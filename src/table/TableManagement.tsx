import React, {
  useEffect,
  useState,
} from 'react';

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
  Grid,
  Modal,
  Stack,
  Typography,
} from '@mui/material';
import { styled } from '@mui/system';

const StyledCard = styled(Card)(({ status }: { status: string }) => ({
  minHeight: "200px",
  cursor: "pointer",
  transition: "all 0.3s ease",
  background:
    status === "active"
      ? "#e8f5e9"
      : status === "attention"
        ? "#ffebee"
        : "#f5f5f5",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
  }
}));

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

type Table = {
  id: number;
  status: "active" | "attention" | "available";
  orderTime: Date | null;
  timer: number;
  orders: { item: string; quantity: number; notes: string }[];
}

const TableManagerment = () => {
  const [tables, setTables] = useState<Table[]>(
    Array.from({ length: 20 }, (_, index) => ({
      id: index + 1,
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

  useEffect(() => {
    const timer = setInterval(() => {
      setTables(prevTables =>
        prevTables.map(table => ({
          ...table,
          timer: table.status !== "available" ? new Date().getMilliseconds() - table.orderTime!.getMilliseconds() : 0
        }))
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (ms: Date) => {
    const minutes = Math.floor(ms.getMilliseconds() / 60000);
    return `${minutes % 60}m`;
  };

  const handleMoveToHistory = (tableId: number) => {
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

  const renderTableStatus = (status: string) => {
    switch (status) {
      case "active":
        return <FiCheckCircle color="#4caf50" size={24} />;
      case "attention":
        return <FiAlertCircle color="#f44336" size={24} />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ padding: "20px" }}>
      <Grid container spacing={3}>
        {tables.map(table => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={table.id}>
            <StyledCard
              status={table.status}
              onClick={() => setSelectedTable(table)}
            >
              <CardContent>
                <Stack spacing={2} alignItems="center">
                  <Typography variant="h4">Table {table.id}</Typography>
                  {renderTableStatus(table.status)}
                  {table.status !== "available" && (
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <FiClock />
                      <Typography>
                        {formatTime(table.orderTime!)}
                      </Typography>
                    </Stack>
                  )}
                  {table.status !== "available" && (
                    <Button
                      variant="contained"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMoveToHistory(table.id);
                      }}
                    >
                      Move to History
                    </Button>
                  )}
                </Stack>
              </CardContent>
            </StyledCard>
          </Grid>
        ))}
      </Grid>

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