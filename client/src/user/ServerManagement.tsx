import { Box, Button } from '@mui/material';
import React, { useContext, useState } from 'react';
import { MdOutlineBrowserUpdated } from 'react-icons/md';
import { COMPONENT } from '../my/my-component';
import { DataGrid, GridActionsCellItem, GridColDef, GridRenderCellParams, GridRowId, } from '@mui/x-data-grid';
import { StyledPaper } from '../my/my-styled';
import { Auth } from '../my/my-class';
import { FaPlus } from 'react-icons/fa';
import { syncServer, SYNC_TYPE } from '../my/my-ws';
import { CONTEXT } from '../App';

class AuthRow extends Auth {
    id: number;
    constructor(id: number, name: string, code: string) {
        super(name, code);
        this.id = id;
    }
}

export default function ServerManagement(props: { back: () => void }) {
    const { logout } = useContext(CONTEXT.Auth);

    const USERS = JSON.parse(localStorage.getItem('users')!);

    let rowsData = Object.entries(USERS)
        .map(([code, json], index) => new AuthRow(index, (json as Object)['name' as keyof typeof json], code));

    const edit = (nextRowsData: AuthRow[]) => rowsData = nextRowsData;

    const saveThenSync = () => {
        if (new Set(rowsData.map(row => row.code)).size !== rowsData.length) {
            logout();
            alert('Code already used by another server');
            return;
        }
        const users = rowsData.reduce((a, v) => ({ ...a, [v.code]: { 'name': v.name } }), {})
        syncServer(SYNC_TYPE.USERS, users);
        logout();
    }

    return (<>
        <COMPONENT.Header back={props.back} actions={<Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <Box sx={{ ml: 5 }}>
                <COMPONENT.WrapCategoryButton props={{
                    selectedCategory: 'Save & Sync', category: 'Save & Sync', setCategory: saveThenSync,
                    size: 'xlarge', icon: <MdOutlineBrowserUpdated style={{ fontSize: 25, marginLeft: 2 }} />,
                }} />
            </Box>
        </Box>} />
        <ServersTable rowsData={rowsData} edit={edit} />
    </>);
}

const ServersTable = (props: { rowsData: AuthRow[], edit: (rowsData: AuthRow[]) => void }) => {
    const [rows, setRows] = useState<AuthRow[]>(props.rowsData);

    const onNewServer = () => {
        const newServer = new AuthRow(rows.length, `New sever ${rows.length}`, '2222');
        const nextRows = [...rows, newServer];
        props.edit(nextRows);
        setRows(nextRows);
    }

    const onDelete = (id: GridRowId) => {
        const nextRows = rows.filter((row) => row.id !== id);
        props.edit(nextRows);
        setRows(nextRows);
    };

    const onUpdate = (editRow: AuthRow) => {
        if (!editRow) return;
        const usedCodeIndex = rows.findIndex((row) => {
            return row.code.toString() === editRow.code.toString() && editRow.id.toString() !== row.id.toString();
        });
        if (usedCodeIndex !== -1) {
            alert('Code already used by another server');
            return;
        }
        const nextRow = new AuthRow(editRow.id, editRow.name, editRow.code);
        const nextRows = rows.map((row) => row.id === nextRow.id ? nextRow : row);
        props.edit(nextRows);
        setRows(nextRows);
    }

    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Name', width: 150, editable: true },
        {
            field: 'code', headerName: 'Access code', sortable: false, width: 180, editable: true, filterable: false,
            valueParser: (value) => value.replace(/[^0-9]/g, ''),
            renderCell: (params: GridRenderCellParams<any, String>) => (<>****</>)
        },
        { field: 'authority', headerName: 'Authority', sortable: false, width: 200 },
        {
            field: 'actions',
            headerName: 'Action',
            type: 'actions',
            width: 135,
            getActions: ({ id }) => [
                <GridActionsCellItem onClick={() => onDelete(id)} sx={{ width: 60 }}
                    icon={<Button variant="outlined" size="small" sx={{ borderRadius: 5 }}>Delete</Button>} label="Delete" />,
            ]
        }
    ];

    return (<StyledPaper sx={{ display: 'flex', flexDirection: 'column', margin: 1, pt: 0, pb: 0 }}>
        <Button color="primary" variant='contained' sx={{ width: '150px' }} endIcon={<FaPlus style={{ fontSize: 14 }} />} onClick={onNewServer}>
            New server
        </Button>
        <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
                pagination: { paginationModel: { page: 0, pageSize: 10 } },
                sorting: { sortModel: [{ field: 'id', sort: 'desc' }] },
            }}
            pageSizeOptions={[5, 10]}
            sx={{ border: 0 }}
            processRowUpdate={(updatedRow, originalRow) => {
                onUpdate(updatedRow);
            }}
            onProcessRowUpdateError={(err) => { }}
        />
    </StyledPaper>)
}