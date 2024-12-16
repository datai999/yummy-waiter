import React, { useEffect, useState } from 'react';

import { Table } from 'myTable';

import styled from '@emotion/styled';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Modal,
  Stack,
  Typography,
} from '@mui/material';
import { FiAlertCircle, FiCheckCircle, FiClock } from 'react-icons/fi';
import { TableStatus } from '../my/my-constants';

const StyledCard = styled(Card)(({ status }: { status: TableStatus }) => ({
  minHeight: "200px",
  cursor: "pointer",
  transition: "all 0.3s ease",
  // background:
  //   status === "active"
  //     ? "#e8f5e9"
  //     : status === "attention"
  //       ? "#ffebee"
  //       : "#f5f5f5",
  background:
    status === TableStatus.ACTIVE
      ? "#ffebee"
      : status === TableStatus.AVAILABLE
        ? "#f5f5f5"
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

const CardTable = ({ table, orderTable, doneTable }: {
  table: Table,
  orderTable: (tableId: string) => void,
  doneTable: (tableId: string) => void
}) => {
  const [timer, setTimer] = useState(0);
  const [openOrderModal, setOpenOrderModal] = useState(false);

  useEffect(() => {
    if (table.orderTime) {
      let interval = setInterval(() => {
        const diff = Math.floor((new Date().getTime() - table.orderTime!.getTime()) / 1000);
        setTimer(diff);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [table.orderTime]);

  const cardOnClick = () => {
    console.log("Card clicked", table);
    if (table.status === TableStatus.AVAILABLE) {
      orderTable(table.id);
    } else setOpenOrderModal(true);
  }

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

  const formatTime = (seconds: number) => {
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (<>
    <StyledCard
      status={table.status}
      onClick={cardOnClick}
    >
      <CardContent>
        <Stack spacing={2} alignItems="center">
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="h4">Table {table.id}</Typography>
            {/* {renderTableStatus(table.status)} */}
            {table.status !== TableStatus.AVAILABLE && (
              <>
                <FiClock />
                <Typography>
                  {formatTime(timer)}
                </Typography>
              </>
            )}
          </Stack>
          {table.status !== TableStatus.AVAILABLE && (
            <Button
              variant="contained"
              onClick={(e) => {
                e.stopPropagation();
                doneTable(table.id);
              }}
            >
              Clean table
            </Button>
          )}
        </Stack>
      </CardContent>
    </StyledCard>

    <Modal
      open={Boolean(openOrderModal)}
      onClose={() => setOpenOrderModal(false)}
    >
      <ModalContent>
        {openOrderModal && (
          <>
            <Typography variant="h5" gutterBottom>
              Table {table.id}
            </Typography>
            <Stack spacing={2}>
              {table.orders.map((order, index) => (
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
              onClick={() => setOpenOrderModal(false)}
              sx={{ mt: 3 }}
            >
              Close
            </Button>
          </>
        )}
      </ModalContent>
    </Modal>
  </>);
}

export default CardTable;
