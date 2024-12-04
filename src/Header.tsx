import { Grid2, Typography, Select, MenuItem } from "@mui/material";
import React, { useState } from "react";
import { StyledPaper } from "./Common";
import { styled } from "@mui/system";
import YummyLogo from "./assets/yummy.png";

const LogoImage = styled("img")({
    width: "80px",
    height: "80px",
    marginRight: "16px",
    objectFit: "contain"
});

const Header = () => {
    const [selectedTable, setSelectedTable] = useState("");

    return (
        <StyledPaper>
            <Grid2 container spacing={2} alignItems="center">
                <Grid2 size={{ xs: 12, sm: 9 }}>
                    <Typography variant="h5" gutterBottom>
                        <LogoImage
                            src={YummyLogo}
                            alt="Yummy Logo"
                        />
                        Yummy Pho 2
                    </Typography>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 3 }}>
                    <Select
                        fullWidth
                        value={selectedTable}
                        onChange={(e) => setSelectedTable(e.target.value)}
                        displayEmpty
                    >
                        <MenuItem value="">Select Table</MenuItem>
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