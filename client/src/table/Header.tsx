import React from 'react';

import {
  Grid2,
  Paper,
  styled,
  Typography,
} from '@mui/material';

import YummyLogo from '../assets/yummy.png';

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

const Header = () => {
    return (
        <StyledPaper>
            <Grid2 container spacing={2} alignItems="center">
                <Grid2 size={{ xs: 2, sm: 1, md: 1 }}>
                    <LogoImage src={YummyLogo} alt="Yummy Logo" sx={{ display: { xs: 'none', sm: 'block' } }} />
                    <LogoImageXS src={YummyLogo} alt="Yummy Logo" sx={{ display: { xs: 'block', sm: 'none' } }} />
                </Grid2>
                <Grid2 size='grow'  >
                    <Typography fontWeight='fontWeightMedium' variant="h5" sx={{ textAlign: "center", display: 'flex' }}>
                        Yummy Phở 2
                    </Typography>
                </Grid2>
            </Grid2>
        </StyledPaper >);
}

export default Header;