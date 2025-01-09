import React from 'react';

import {
    Box,
    Grid2,
    Paper,
    styled,
    Typography,
} from '@mui/material';

import YummyLogo from '../assets/yummy.png';
import { CategoryButton } from '../my/my-styled';
import { GiPaperBagFolded } from 'react-icons/gi';

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

const Header = (props: { newTogo: () => void }) => {
    return (
        <StyledPaper>
            <Grid2 container spacing={2} alignItems="center">
                <Grid2 size={{ xs: 2, sm: 2, md: 1 }}>
                    <LogoImage src={YummyLogo} alt="Yummy Logo" sx={{ display: { xs: 'none', sm: 'block' } }} />
                    <LogoImageXS src={YummyLogo} alt="Yummy Logo" sx={{ display: { xs: 'block', sm: 'none' } }} />
                </Grid2>
                <Grid2 size='grow'  >
                    <Typography fontWeight='fontWeightMedium' variant="h5" sx={{ textAlign: "center", display: 'flex' }}>
                        Yummy Phở 2
                    </Typography>
                </Grid2>
                <Grid2 size={{ xs: 4, sm: 2, md: 2 }}>
                    <CategoryButton variant="outlined" size='large' selected={false} fullWidth={true} sx={{ borderRadius: 5 }}
                        onClick={props.newTogo}>
                        New togo
                        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                            <GiPaperBagFolded style={{ fontSize: 30, marginLeft: 8 }} />
                        </Box>
                    </CategoryButton>
                </Grid2>
            </Grid2>
        </StyledPaper >);
}

export default Header;