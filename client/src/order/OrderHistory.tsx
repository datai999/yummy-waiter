import React, { useEffect, useState } from "react";
import Header from "./Header";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { SYNC_TYPE, syncServer } from "../my/my-ws";
import { UTILS } from "../my/my-util";
import { Table } from "../my/my-class";
import { useMediaQuery } from "@mui/material";
import { StyledPaper } from "../my/my-styled";

const columns: GridColDef[] = [
    { field: 'id', headerName: 'Order', width: 110 },
    { field: 'cleanTime', headerName: 'Clean', width: 110 },
    { field: 'orderName', headerName: 'Table', width: 120 },
    { field: 'servers', headerName: 'Servers', sortable: false, width: 200 },
    { field: 'note', headerName: 'Note', sortable: false, width: 200 },
    {
        field: 'fullName',
        headerName: 'Detail',
        description: 'This column has a value getter and is not sortable.',
        sortable: false,
        width: 160,
        valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,

    },
];

class RowData {
    id: string;
    cleanTime: string;
    orderName: string;
    servers: string;
    note: string;

    constructor(table: Table) {
        this.id = UTILS.formatTime(table.orderTime).split(',')[1].trim();
        this.cleanTime = !table.cleanTime ? '' : UTILS.formatTime(table.cleanTime).split(',')[1].trim();
        this.orderName = table.getName();
        this.servers = table.getServers().join(',');
        this.note = table.note || '';
    }
}

let rowsData: RowData[] = [];
let rerenderOutside: () => void = () => console.log('error');

export const updateHistoryOrder = (historyOrder: Table[]) => {
    rowsData = historyOrder.map(table => new RowData(table));
    if (rerenderOutside)
        rerenderOutside();
}

export default function OrderHistory(props: { setHistoryOrder: (state: boolean) => void }) {
    const [refresh, setRefresh] = useState(false);

    const rerender = () => setRefresh(!refresh);

    useEffect(() => {
        rerenderOutside = rerender;
        syncServer(SYNC_TYPE.HISTORY_ORDER, UTILS.formatTime());
    }, [])

    const mdSize = useMediaQuery('(min-width:900px)');

    return (<>
        <Header setHistoryOrder={props.setHistoryOrder} />
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
    </>);
}
