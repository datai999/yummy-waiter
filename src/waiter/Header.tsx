import { Paper, styled, Grid2, Typography, Select, MenuItem, Box } from "@mui/material";
import React, { useState } from "react";
import YummyLogo from "./../assets/yummy.png";
import { Categories } from "../my-constants";
import { CategoryButton } from "../my-styled";

const LogoImage = styled("img")({
    width: "60px",
    height: "60px",
    marginRight: "16px",
    objectFit: "contain"
});

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(1),
    paddingBottom: 0,
    backgroundColor: "#fff",
    borderRadius: theme.shape.borderRadius,
}));

type Props = {
    selectedTable: string,
    setSelectedTable(selectedTable: string): void,
    selectedCategory: Categories,
    setSelectedCategory(selectedItems: Categories): void;
};

const Header = ({ selectedTable, setSelectedTable, selectedCategory, setSelectedCategory }: Props) => {
    return (
        <StyledPaper>
            <Grid2 container spacing={2} alignItems="center">
                <Grid2 size={{ xs: 2, sm: 1, md: 1 }}>
                    <LogoImage src={YummyLogo} alt="Yummy Logo" />
                </Grid2>
                <Grid2 size={{ xs: 4, sm: 6, md: 2 }}  >
                    <Typography fontWeight='fontWeightMedium' variant="h5" sx={{ display: { xs: 'none', sm: 'block' } }}>
                        Yummy Phở 2
                    </Typography>
                    <Typography fontWeight='fontWeightMedium' variant="h5" sx={{ display: { xs: 'flex', sm: 'none', md: 'none', lg: 'none' } }}>
                        Yummy
                    </Typography>
                    <Typography fontWeight='fontWeightMedium' variant="h5" sx={{ display: { xs: 'flex', sm: 'none', md: 'none', lg: 'none' } }}>
                        Phở 2
                    </Typography>
                </Grid2>
                <Grid2 size={{ md: 7 }} sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }}>
                    {Object.values(Categories).map((category) => (
                        <CategoryButton
                            key={category}
                            selected={selectedCategory === Categories[category as keyof typeof Categories]}
                            onClick={() => setSelectedCategory(Categories[category as keyof typeof Categories])}
                            variant="contained"
                        >
                            {category}
                        </CategoryButton>
                    ))}
                </Grid2>
                <Grid2 size={{ xs: 6, sm: 5, md: 2 }}>
                    <Select
                        fullWidth
                        value={selectedTable}
                        onChange={(e) => setSelectedTable(e.target.value)}
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
        </StyledPaper>);
}

export default Header;