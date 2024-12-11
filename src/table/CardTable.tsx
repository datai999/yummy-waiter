import React, { useEffect, useState } from 'react';

import { Table } from 'myTable';

import styled from '@emotion/styled';
import {
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from '@mui/material';
import { FiAlertCircle, FiCheckCircle, FiClock } from 'react-icons/fi';

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

const CardTable = ({ table, doneTable }: { table: Table, doneTable: (tableId: string) => void }) => {
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    if (table.orderTime) {
      let interval = setInterval(() => {
        const diff = Math.floor((new Date().getTime() - table.orderTime!.getTime()) / 1000);
        setTimer(diff);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [table.orderTime]);


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

  return (<StyledCard
    status={table.status}
    onClick={() => {
      //TODO
    }}
  >
    <CardContent>
      <Stack spacing={2} alignItems="center">
        <Typography variant="h4">Table {table.id}</Typography>
        {renderTableStatus(table.status)}
        {table.status !== "available" && (
          <Stack direction="row" alignItems="center" spacing={1}>
            <FiClock />
            <Typography>
              {formatTime(timer)}
            </Typography>
          </Stack>
        )}
        {table.status !== "available" && (
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
  </StyledCard>);
}

export default CardTable;
