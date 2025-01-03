import React, { useEffect, useState } from 'react';

import styled from '@emotion/styled';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid2,
  Modal,
  Stack,
  Typography,
} from '@mui/material';
import { FiAlertCircle, FiCheckCircle, FiClock } from 'react-icons/fi';
import { TableStatus } from '../my/my-constants';
import OrderSummary from '../waiter/DetailOrder';
import { StyledPaper } from '../my/my-styled';
import { Table } from '../my/my-class';

const StyledCard = styled(Card)(({ status }: { status: TableStatus }) => ({
  minHeight: "100px",
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
  orderTable: (table: Table) => void,
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
    if (table.status === TableStatus.AVAILABLE) {
      orderTable(table);
    } else setOpenOrderModal(true);
  }

  const renderTableStatus = (status: string) => {
    switch (status) {
      case "ACTIVE":
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
      <CardContent sx={{ p: 1 }}>
        <Grid2 container>
          <Grid2 size={{ xs: 0, sm: 4, md: 4 }} />
          <Grid2 size='grow' >
            <Typography variant="h5">{table.id}</Typography>
          </Grid2>
          {/* {renderTableStatus(table.status)} */}
          <Grid2>
            {table.status !== TableStatus.AVAILABLE && (
              <Typography>
                {formatTime(timer)}
              </Typography>
            )}
          </Grid2>
        </Grid2>
        {/* <Typography>
          {table.orderTime && table.orderTime.toLocaleTimeString()}
        </Typography> */}
      </CardContent>
    </StyledCard >

    <Modal
      open={Boolean(openOrderModal)}
      onClose={() => setOpenOrderModal(false)}
    >
      <ModalContent key={table.id}>
        {openOrderModal && (
          <Box id={"Table.ModalContent.Box." + table.id} >
            <Grid2 container sx={{ pb: 1 }}>
              <Grid2 size={{ xs: 0, sm: 4, md: 4 }} />
              <Grid2 size='grow' >
                <Typography variant="h5">{table.id}</Typography>
              </Grid2>
              {/* {renderTableStatus(table.status)} */}
              <Grid2>
                {table.status !== TableStatus.AVAILABLE && (
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <FiClock />
                    <Typography>
                      {formatTime(timer)}
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={() => {
                        orderTable(table);
                      }}
                    >
                      Modify
                    </Button>
                  </Stack>
                )}
              </Grid2>
            </Grid2>
            {Array.from(table.bags.entries()).map(([key, item], index) => (
              <Box key={index}>
                <Typography variant="h6" style={{ fontWeight: 'bold' }} >
                  {key === 0 ? 'Dine-in' : `Togo ${key}`}
                </Typography>
                <OrderSummary
                  key={index}
                  bag={key}
                  categoryItems={item}
                  phoId={"null"} />
                {index < table.bags.size - 1 && (<Divider sx={{ pt: 1, pb: 1 }} />)}
              </Box>))
            }
            <Button
              fullWidth
              variant="contained"
              onClick={() => {
                setOpenOrderModal(false);
                doneTable(table.id);
              }}
              sx={{ mt: 3 }}
            >
              Clear table
            </Button>
          </Box>
        )}
      </ModalContent>
    </Modal>
  </>);
}

export default CardTable;
