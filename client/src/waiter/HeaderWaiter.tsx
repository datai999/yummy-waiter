import React, { useContext } from 'react';

import {
    Box,
    Divider,
    Grid2,
    MenuItem,
    Paper,
    Select,
    styled,
    Typography,
    useMediaQuery,
} from '@mui/material';

import YummyLogo from '../assets/yummy.png';
import { MENU, TableStatus } from '../my/my-constants';
import { CategoryButton } from '../my/my-styled';
import { ChildWaiterProps } from './Waiter';
import { changeTable } from '../my/my-service';
import { LockedTable, Table } from '../my/my-class';
import { CONTEXT } from '../App';
import { GiChicken } from 'react-icons/gi';
import { PiCow } from 'react-icons/pi';
import { RiDrinks2Line } from 'react-icons/ri';
import { FaPen } from 'react-icons/fa';
import { syncServer, SYNC_TYPE } from '../my/my-ws';
import { COMPONENT } from '../my/my-component';

const LogoImage = styled("img")({
    width: "60px",
    height: "60px",
    marginLeft: "16px",
    objectFit: "contain"
});

const LogoImageXS = styled("img")({
    width: "40px",
    height: "40px",
    marginLeft: "10px",
    marginRight: "10px",
    objectFit: "contain"
});

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(1),
    paddingTop: 2,
    paddingBottom: 1,
    backgroundColor: "#fff",
    borderRadius: theme.shape.borderRadius,
}));


const Header = ({ props }: { props: ChildWaiterProps }) => {
    const { auth, logout } = useContext(CONTEXT.Auth);
    const { table, orderTable } = useContext(CONTEXT.Table);

    const lockedServer = useContext(CONTEXT.LockedTable)(table.id);
    const mdSize = useMediaQuery('(min-width:900px)');

    const routeTableManagement = () => {
        orderTable(null);
        if (!lockedServer || auth.name === lockedServer) {
            syncServer(SYNC_TYPE.LOCKED_TABLES, { [table.id]: new LockedTable(false, auth.name) });
        }
    }

    return (
        <StyledPaper>
            <Box sx={{ display: 'flex', direction: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', direction: 'row', alignItems: 'center' }}>
                    <LogoImage src={YummyLogo} alt="Yummy Logo" sx={{ display: { xs: 'none', sm: 'block' } }} onClick={routeTableManagement} />
                    <LogoImageXS src={YummyLogo} alt="Yummy Logo" sx={{ display: { xs: 'block', sm: 'none' } }} onClick={routeTableManagement} />
                    {mdSize && <Typography fontWeight='fontWeightMedium' variant="h4" sx={{ textAlign: "center", display: 'flex', ml: 1 }}>
                        Yummy Phở 2
                    </Typography>}
                    <Typography fontWeight='fontWeightMedium' variant="h5" sx={{ textAlign: "center", display: 'flex', ml: 1, mt: 1 }}>
                        {mdSize ? ':' : ''} {auth.name}
                    </Typography>
                </Box>
                <Box>
                    {Object.keys(MENU).map((category) => (
                        <COMPONENT.WrapCategoryButton key={category} props={{
                            selectedCategory: props.category, category: category, setCategory: props.setCategory,
                            size: mdSize ? 'xlarge' : 'xlarge',
                        }} />
                    ))}
                </Box>
                <Box sx={{ maxWidth: '200px', minWidth: '150px' }}>
                    <TableSelections props={props} size={mdSize ? 'medium' : 'medium'} />
                </Box>
            </Box>
        </StyledPaper >);
}

const TableSelections = ({ props, size }: { props: ChildWaiterProps, size: string }) => {
    const { auth } = useContext(CONTEXT.Auth);
    const { table, orderTable } = useContext(CONTEXT.Table);

    const lockedServer = useContext(CONTEXT.LockedTable)(table.id);

    let tableIdAvailable = Array.from(props.tables.values())
        .filter((table: Table) => table.status === TableStatus.AVAILABLE && table.id.startsWith("Table"))
        .map(table => table.id);

    if (!tableIdAvailable.includes(table.id))
        tableIdAvailable = [table.id, ...tableIdAvailable];

    if (table.id.startsWith("Togo"))
        tableIdAvailable = [table.getName()];

    return (<Select
        fullWidth
        value={table.id.startsWith("Togo") ? table.getName() : table.id}
        disabled={Boolean(lockedServer)}
        onChange={(e) => {
            const toTable = changeTable(auth, props.tables, table, e.target.value) as Table;
            orderTable(toTable);
        }}
        displayEmpty
        size={size === "small" ? "small" : "medium"}
    >
        {tableIdAvailable.map((tableId) => (
            <MenuItem key={tableId} value={tableId}>
                {tableId}{lockedServer ? <> :{`${lockedServer} `}<FaPen style={{ fontSize: 12 }} /></> : ''}
            </MenuItem>
        ))}
    </Select>);
}

export default Header;