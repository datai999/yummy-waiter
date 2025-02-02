import React, { useContext, useEffect, useState } from 'react';

import styled from '@emotion/styled';
import {
  Badge,
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
import OrderSummary from '../order/DetailOrder';
import { StyledPaper } from '../my/my-styled';
import { Table } from '../my/my-class';
import { GiChicken } from 'react-icons/gi';
import { PiCow } from 'react-icons/pi';
import { CONTEXT } from '../App';
import { FaPen } from 'react-icons/fa';

const StyledCard = styled(Card)(({ status }: { status: TableStatus }) => ({
  minHeight: "95px",
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

const CardTable = ({ table, orderTable }: {
  table: Table,
  orderTable: (table: Table) => void,
}) => {
  const lockedServer = useContext(CONTEXT.LockedTable)(table.id);
  const [timer, setTimer] = useState(0);

  const tableServers = table.getServers();

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
    orderTable(table);
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours > 0 ? hours + ':' : ''}${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (<>
    <StyledCard
      status={lockedServer ? TableStatus.ACTIVE : table.status}
      onClick={cardOnClick}
    >
      <CardContent sx={{ p: 1, pb: 0, pt: 0, maxHeight: '90px' }}>
        <Grid2 container>
          <Grid2 size='grow' >
            <Box sx={{ mb: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography variant="h5" sx={{ textAlign: 'center' }}>{table.getName()}</Typography>
              {table.note && <Typography variant="caption" sx={{ textAlign: 'center' }}>{` ${table.note}`}</Typography>}
            </Box>
            {table.status !== TableStatus.AVAILABLE &&
              <Stack direction="row" spacing={table.bags.size > 2 ? 0 : 2} sx={{ justifyContent: "center", alignItems: "stretch", }}>
                {Array.from(table.bags.entries()).map(([key, item], index) => <Box key={index} >
                  <Badge badgeContent={item.get('BEEF')?.getPhoActualQty()} color="primary" anchorOrigin={{ vertical: 'top', horizontal: 'right', }}
                    sx={{ mb: 0, pb: 0, ml: 0 }}>
                    <PiCow style={{ fontSize: 24, marginLeft: 6 }} />
                  </Badge>
                  <Badge badgeContent={item.get('CHICKEN')?.getPhoActualQty()} color="primary" anchorOrigin={{ vertical: 'top', horizontal: 'right', }}
                    sx={{ mb: 0, pb: 0, ml: 0 }}>
                    <GiChicken style={{ fontSize: 24, marginLeft: 6 }} />
                  </Badge>
                </Box>)}
              </Stack>}
          </Grid2>
          <Grid2>
            {(table.status !== TableStatus.AVAILABLE || lockedServer) && <>
              <Typography>
                {formatTime(timer)}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {lockedServer && !tableServers.includes(lockedServer || '') &&
                  <Box sx={{ fontSize: 12 }}>
                    {`${lockedServer} `}
                    <FaPen />
                  </Box>}
                {tableServers.map(server =>
                  <Box key={server} sx={{ fontSize: 12 }}>
                    {`${server} `}
                    {lockedServer === server && <FaPen />}
                  </Box>)}
              </Box>
            </>}
          </Grid2>
        </Grid2>
      </CardContent>
    </StyledCard >
  </>);
}

export default CardTable;
