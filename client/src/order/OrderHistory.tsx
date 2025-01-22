import React, { useEffect, useState } from "react";
import Header from "./Header";
import { DataGrid, GridActionsCellItem, GridColDef, GridRenderCellParams, GridRowParams } from "@mui/x-data-grid";
import { SYNC_TYPE, syncServer } from "../my/my-ws";
import { UTILS } from "../my/my-util";
import { Order, Receipt } from "../my/my-class";
import { Box, Button, Divider, Grid2, Modal, Stack, styled, Typography, useMediaQuery } from "@mui/material";
import { StyledPaper } from "../my/my-styled";
import { TableContext } from "../App";
import OrderView from "./OrderView";

let viewOrder = (index: number) => console.log(`viewOrder: ${index}`);

const columns: GridColDef[] = [
    { field: 'id', headerName: 'Order', width: 110 },
    { field: 'cleanTime', headerName: 'Clean', width: 110 },
    { field: 'orderName', headerName: 'Table', width: 110 },
    { field: 'servers', headerName: 'Servers', sortable: false, width: 150 },
    { field: 'cashier', headerName: 'Cashier', sortable: false, width: 100 },
    { field: 'amount', headerName: '$', width: 80 },
    { field: 'note', headerName: 'Note', sortable: false, width: 230 },
    {
        field: 'actions',
        type: 'actions',
        width: 135,
        getActions: (params: GridRowParams) => [
            <GridActionsCellItem onClick={() => viewOrder(params.row.index)} sx={{ width: 60 }} icon={<Button variant="outlined" size="small" sx={{ borderRadius: 5, margin: 0 }}>View</Button>} label="View" />,
            <GridActionsCellItem onClick={() => { }} sx={{ width: 60 }} icon={<Button variant="outlined" size="small" sx={{ borderRadius: 5 }}>Receipt</Button>} label="Print" />,
        ]
    }
];

class RowData {
    index: number;
    id: string;
    cleanTime: string;
    orderName: string;
    servers: string;
    cashier: string;
    amount: string;
    note: string;

    constructor(receipt: Receipt, index: number) {
        this.index = index;
        this.id = UTILS.formatTime(receipt.orderTime).split(',')[1].substring(1, 9);
        this.cleanTime = !receipt.cleanTime ? '' : UTILS.formatTime(receipt.cleanTime).split(',')[1].substring(1, 9);
        this.orderName = receipt.getName();
        this.servers = receipt.getServers().join(',');
        this.cashier = receipt.cashier || '';
        this.amount = receipt.total.toFixed(2) || '';
        this.note = receipt.note || '';
    }
}

let HISTORY_RECEIPT: Receipt[] = [];
let rowsData: RowData[] = [];
let setHistoryDateOutSide: () => void = () => console.log('error');

export const updateHistoryOrder = (historyOrder: Receipt[]) => {
    HISTORY_RECEIPT = historyOrder;
    rowsData = historyOrder.map((table, index) => new RowData(table, index));
    if (setHistoryDateOutSide) {
        setHistoryDateOutSide();
    }
}

export default function OrderHistory(props: { setHistoryOrder: (state: boolean) => void }) {
    const [historyDate, setHistoryDate] = useState<Date>(new Date());
    const [order, setOrder] = useState<Receipt | null>(null);

    useEffect(() => {
        viewOrder = (orderIndex: number) => {
            setOrder(HISTORY_RECEIPT[orderIndex])
        };
        setHistoryDateOutSide = () => setHistoryDate(new Date());
        syncServer(SYNC_TYPE.HISTORY_ORDER, UTILS.formatTime());
    }, [])

    const mdSize = useMediaQuery('(min-width:900px)');

    const onChangeHistoryDate = (newDate: Date) => {
        setHistoryDateOutSide = () => setHistoryDate(newDate);
        syncServer(SYNC_TYPE.HISTORY_ORDER, UTILS.formatTime(newDate));
    }

    return (<>
        <Header setHistoryOrder={props.setHistoryOrder} historyDate={historyDate} setHistoryDate={onChangeHistoryDate} />
        <StyledPaper sx={{ display: 'flex', margin: 1, pt: 0, pb: 0 }}>
            <DataGrid
                rows={rowsData}
                columns={columns}
                initialState={{
                    pagination: { paginationModel: { page: 0, pageSize: mdSize ? 10 : 15 } },
                    sorting: { sortModel: [{ field: 'id', sort: 'desc' }] },
                }}
                pageSizeOptions={[5, 10]}
                sx={{ border: 0 }}
            />
        </StyledPaper>
        <Modal
            open={Boolean(order)}
            onClose={() => setOrder(null)}
        >
            <ModalContent>
                {order && (
                    <Box  >
                        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                            <Typography variant="h4" sx={{ mb: 2 }}>{order.getName()}</Typography>
                            {order.note && <Typography variant="h6" sx={{ mt: '10px' }}>: {order.note}</Typography>}
                        </Box>
                        <TableContext.Provider value={{ table: order, order: order, orderTable: () => { }, setOrder: () => { }, prepareChangeTable: () => { } }}>
                            <OrderView bags={order.bags} phoId={''} />
                        </TableContext.Provider>
                    </Box>
                )}
            </ModalContent>
        </Modal>
    </>);
}

const ModalContent = styled(Box)({
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "600px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    padding: "20px",
    maxHeight: "80vh",
    overflowY: "auto"
});
