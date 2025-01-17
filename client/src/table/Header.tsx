import React, { useContext } from 'react';

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
import { AuthContext } from '../App';

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

const Header = (props: { newTogo: () => void }) => {
    const { auth, logout } = useContext(AuthContext);

    return (
        <StyledPaper sx={{ display: 'flex', direction: 'row', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', direction: 'row', alignItems: 'center' }}>
                <LogoImage src={YummyLogo} alt="Yummy Logo" sx={{ display: { xs: 'none', sm: 'block' } }} onClick={logout} />
                <LogoImageXS src={YummyLogo} alt="Yummy Logo" sx={{ display: { xs: 'block', sm: 'none' } }} onClick={logout} />
                <Typography fontWeight='fontWeightMedium' variant="h4" sx={{ textAlign: "center", display: 'flex', ml: 1 }}>
                    Yummy Phở 2
                </Typography>
                <Typography fontWeight='fontWeightMedium' variant="h5" sx={{ textAlign: "center", display: 'flex', ml: 1, mt: 1 }}>
                    : {auth.name}
                </Typography>
            </Box>
            <CategoryButton variant="outlined" size='large' selected={false} sx={{ borderRadius: 5, pl: 2, pr: 2 }}
                onClick={props.newTogo}>
                New togo
                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                    <GiPaperBagFolded style={{ fontSize: 30, marginLeft: 3 }} />
                </Box>
            </CategoryButton>
        </StyledPaper >);
}

export default Header;
