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
import { Table } from '../my/my-class';
import { AuthContext, TableContext } from '../App';
import { GiChicken } from 'react-icons/gi';
import { PiCow } from 'react-icons/pi';
import { RiDrinks2Line } from 'react-icons/ri';

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
    paddingBottom: 0,
    backgroundColor: "#fff",
    borderRadius: theme.shape.borderRadius,
}));


const Header = ({ props }: { props: ChildWaiterProps }) => {
    const { auth, logout } = useContext(AuthContext);
    const { orderTable } = useContext(TableContext);

    return (
        <StyledPaper>
            <Box sx={{ display: 'flex', direction: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', direction: 'row', alignItems: 'center' }}>
                    <LogoImage src={YummyLogo} alt="Yummy Logo" sx={{ display: { xs: 'none', sm: 'block' } }} onClick={() => orderTable(null)} />
                    <LogoImageXS src={YummyLogo} alt="Yummy Logo" sx={{ display: { xs: 'block', sm: 'none' } }} onClick={() => orderTable(null)} />
                    <Typography fontWeight='fontWeightMedium' variant="h4" sx={{ textAlign: "center", display: 'flex', ml: 1 }}>
                        Yummy Phở 2
                    </Typography>
                    <Typography fontWeight='fontWeightMedium' variant="h5" sx={{ textAlign: "center", display: 'flex', ml: 1, mt: 1 }}>
                        : {auth.name}
                    </Typography>
                </Box>
                <Box>
                    {Object.keys(MENU).map((category) => (
                        <WrapCategoryButton key={category} props={{
                            selectedCategory: props.category, category: category, setCategory: props.setCategory,
                            size: useMediaQuery('(min-width:900px)') ? 'xlarge' : 'medium',
                        }} />
                    ))}
                </Box>
                <Box sx={{ display: { xs: 'none', sm: 'none', md: 'block' }, minWidth: '150px' }}>
                    <TableSelections props={props} size='medium' />
                </Box>
            </Box>
        </StyledPaper >);
}

const iconStyle = {
    fontSize: 25, marginLeft: 12
}

const WrapCategoryButton = ({ props }: {
    props: {
        size: string,
        selectedCategory: string,
        category: string, setCategory: React.Dispatch<string>
    }
}) => {
    return (<CategoryButton
        key={props.category}
        selected={props.selectedCategory === props.category}
        onClick={() => props.setCategory(props.category)}
        variant="contained"
        size={props.size == "small" ? "small" : props.size == "medium" ? "medium" : "large"}
        sx={{
            minHeight: props.size == 'xlarge' ? 50 : 0,
            minWidth: props.size == 'xlarge' ? 120 : props.size === 'large' ? 120 : 0,
            ml: '10px'
        }}
    >
        {props.category}
        {props.category === 'BEEF' && <PiCow style={iconStyle} />}
        {props.category === 'CHICKEN' && <GiChicken style={iconStyle} />}
        {props.category === 'DRINK' && <RiDrinks2Line style={iconStyle} />}
    </CategoryButton>)
}

const TableSelections = ({ props, size }: { props: ChildWaiterProps, size: string }) => {
    const { table, orderTable } = useContext(TableContext);

    let tableIdAvailable = Array.from(props.tables.values())
        .filter((table: Table) => table.status === TableStatus.AVAILABLE && table.id.startsWith("Table"))
        .map(table => table.id);

    if (!tableIdAvailable.includes(table.id))
        tableIdAvailable = [table.id, ...tableIdAvailable];

    return (<Select
        fullWidth
        value={table.id}
        onChange={(e) => {
            const toTable = changeTable(props.tables, table, e.target.value) as Table;
            orderTable(toTable);
        }}
        displayEmpty
        size={size === "small" ? "small" : "medium"}
    >
        {tableIdAvailable.map((tableId) => (
            <MenuItem key={tableId} value={tableId}>
                {tableId}
            </MenuItem>
        ))}
    </Select>);
}

export default Header;