import React from 'react';

import {
    Box,
    Divider,
    Grid2,
    MenuItem,
    Paper,
    Select,
    styled,
    Typography,
} from '@mui/material';

import YummyLogo from '../assets/yummy.png';
import { Categories, TableStatus } from '../my/my-constants';
import { CategoryButton } from '../my/my-styled';
import { Table } from 'myTable';
import { ChildWaiterProps } from './Waiter';
import { changeTable } from '../my/my-service';

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
    return (
        <StyledPaper>
            <Grid2 container spacing={2} alignItems="center">
                <Grid2 size={{ xs: 2, sm: 1, md: 1 }} onClick={() => props.setIsWaiter(false)}>
                    <LogoImage src={YummyLogo} alt="Yummy Logo" sx={{ display: { xs: 'none', sm: 'block' } }} />
                    <LogoImageXS src={YummyLogo} alt="Yummy Logo" sx={{ display: { xs: 'block', sm: 'none' } }} />
                </Grid2>
                <Grid2 size={{ xs: 6, sm: 6, md: 2 }}  >
                    <Typography fontWeight='fontWeightMedium' variant="h5" sx={{ textAlign: "center", display: { xs: 'flex', sm: 'block', md: 'none', lg: 'none' } }}>
                        Yummy Phở 2
                    </Typography>
                    <Typography fontWeight='fontWeightMedium' variant="h5" sx={{ display: { xs: 'none', sm: 'none', md: 'block', lg: 'block' } }}>                        Yummy Phở 2
                    </Typography>
                    <Typography fontWeight='fontWeightMedium' variant="h5" sx={{ display: { xs: 'none', sm: 'none', md: 'none', lg: 'none' } }}>
                        Yummy
                    </Typography>
                    <Typography fontWeight='fontWeightMedium' variant="h5" sx={{ display: { xs: 'none', sm: 'none', md: 'none', lg: 'none' } }}>
                        Phở 2
                    </Typography>
                </Grid2>
                <Grid2 size={{ md: 6 }} sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }}>
                    {Object.values(Categories).map((category) => (
                        <WrapCategoryButton key={category} props={{ selectedCategory: props.category, category: category, setCategory: props.setCategory, size: 'medium' }} />
                    ))}
                </Grid2>
                <Grid2 size={{ xs: 4, sm: 5, md: 'grow' }} sx={{ display: { xs: 'block', sm: 'none', md: 'block' } }}>
                    <TableSelections props={props} size='small' />
                </Grid2>
            </Grid2>

            <Box sx={{ display: { xs: 'none', sm: 'block', md: 'none', flexWrap: "wrap" } }}>
                <Divider textAlign="left" sx={{ mb: 0 }}></Divider>
                <Grid2 container spacing={2} alignItems="center">
                    <Grid2 size={{ sm: 8, }}>
                        {Object.values(Categories).map((category) => (
                            <WrapCategoryButton key={category} props={{ selectedCategory: props.category, category: category, setCategory: props.setCategory, size: 'large' }} />
                        ))}
                    </Grid2>
                    <Grid2 size={{ sm: 'grow', }} >
                        <TableSelections props={props} size='medium' />
                    </Grid2>
                </Grid2>
            </Box>

            <Box sx={{ display: { xs: 'block', sm: 'none', md: 'none' }, flexWrap: "wrap" }}>
                <Divider textAlign="left" sx={{ mb: 0 }}></Divider>
                {Object.values(Categories).map((category) => (
                    <WrapCategoryButton key={category} props={{ selectedCategory: props.category, category: category, setCategory: props.setCategory, size: 'small' }} />
                ))}
            </Box>
        </StyledPaper >);
}

const WrapCategoryButton = ({ props }: {
    props: {
        size: string,
        selectedCategory: Categories,
        category: Categories, setCategory: React.Dispatch<Categories>
    }
}) => {
    return (<CategoryButton
        key={props.category}
        selected={props.selectedCategory === Categories[props.category as keyof typeof Categories]}
        onClick={() => props.setCategory(Categories[props.category as keyof typeof Categories])}
        variant="contained"
        size={props.size == "small" ? "small" : props.size == "medium" ? "medium" : "large"}
    >
        {props.category === Categories.SIDE_ORDERS ? "SIDE ORDER" : props.category}
    </CategoryButton>)
}

const TableSelections = ({ props, size }: { props: ChildWaiterProps, size: string }) => {
    let tableIdAvailable = Array.from(props.tables.values())
        .filter((table: Table) => table.status === TableStatus.AVAILABLE && table.id.startsWith("Table"))
        .map(table => table.id);

    if (!tableIdAvailable.includes(props.table.id))
        tableIdAvailable = [props.table.id, ...tableIdAvailable];

    return (<Select
        fullWidth
        value={props.table.id}
        onChange={(e) => {
            const toTable = changeTable(props.tables, props.table, e.target.value) as Table;
            props.orderTable(toTable);
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