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
import { Categories } from '../my/my-constants';
import { CategoryButton } from '../my/my-styled';
import { Table } from 'myTable';
import { ChildWaiterProps } from './Waiter';

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
                        <CategoryButton
                            key={category}
                            size='large'
                            selected={props.category === Categories[category as keyof typeof Categories]}
                            onClick={() => props.setCategory(Categories[category as keyof typeof Categories])}
                            variant="contained"
                        >
                            {category === Categories.SIDE_ORDERS ? "SIDE ORDER" : category}
                        </CategoryButton>
                    ))}
                </Grid2>
                <Grid2 size={{ xs: 4, sm: 5, md: 'grow' }} sx={{ display: { xs: 'block', sm: 'none', md: 'block' } }}>
                    <Select
                        fullWidth
                        value={props.category}
                        // onChange={(e) => props.orderTable(e.target.value)}
                        displayEmpty
                        size='small'
                    >
                        <MenuItem value="">Table selection</MenuItem>
                        {Array.from({ length: 21 }, (_, i) => (
                            <MenuItem key={i + 1} value={i + 1}>
                                Table {i + 1}
                            </MenuItem>
                        ))}
                    </Select>
                </Grid2>
            </Grid2>

            <Box sx={{ display: { xs: 'none', sm: 'block', md: 'none', flexWrap: "wrap" } }}>
                <Divider textAlign="left" sx={{ mb: 0 }}></Divider>
                <Grid2 container spacing={2} alignItems="center">
                    <Grid2 size={{ sm: 8, }}>
                        {Object.values(Categories).map((category) => (
                            <CategoryButton
                                key={category}
                                selected={props.category === Categories[category as keyof typeof Categories]}
                                onClick={() => props.setCategory(Categories[category as keyof typeof Categories])}
                                variant="contained"
                                size="large"
                            >
                                {category === Categories.SIDE_ORDERS ? "SIDE ORDER" : category}
                            </CategoryButton>
                        ))}
                    </Grid2>
                    <Grid2 size={{ sm: 'grow', }} >
                        <Select
                            fullWidth
                            value={props.table}
                            // onChange={(e) => props.orderTable(e.target.value)}
                            displayEmpty
                        >
                            <MenuItem value="">Table selection</MenuItem>
                            {Array.from({ length: 20 }, (_, i) => (
                                <MenuItem key={i + 1} value={i + 1}>
                                    Table {i + 1}
                                </MenuItem>
                            ))}
                        </Select>
                    </Grid2>
                </Grid2>
            </Box>

            <Box sx={{ display: { xs: 'block', sm: 'none', md: 'none' }, flexWrap: "wrap" }}>
                <Divider textAlign="left" sx={{ mb: 0 }}></Divider>
                {Object.values(Categories).map((category) => (
                    <CategoryButton
                        key={category}
                        selected={props.category === Categories[category as keyof typeof Categories]}
                        onClick={() => props.setCategory(Categories[category as keyof typeof Categories])}
                        variant="contained"
                        size="small"
                    >
                        {category === Categories.SIDE_ORDERS ? "SIDE ORDER" : category}
                    </CategoryButton>
                ))}
            </Box>
        </StyledPaper >);
}

export default Header;