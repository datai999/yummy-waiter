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
import { MdManageHistory, MdOutlineSettings } from 'react-icons/md';

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

const Header = (props: { setSetting: (state: boolean) => void, setHistoryOrder: (state: boolean) => void, newTogo: () => void }) => {
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
            <Box sx={{ mt: '2px' }}>
                <CategoryButton variant="outlined" size='large' selected={false} sx={{ borderRadius: 5, pl: 2, pr: 2, mr: 1, height: '50px' }}
                    onClick={() => props.setSetting(true)}>
                    Setting
                    <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                        <MdOutlineSettings style={{ fontSize: 25, marginLeft: 3 }} />
                    </Box>
                </CategoryButton>
                <CategoryButton variant="outlined" size='large' selected={false} sx={{ borderRadius: 5, pl: 2, pr: 2, mr: 1, height: '50px' }}
                    onClick={() => props.setHistoryOrder(true)}>
                    Order history
                    <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                        <MdManageHistory style={{ fontSize: 25, marginLeft: 3 }} />
                    </Box>
                </CategoryButton>
                <CategoryButton variant="outlined" size='large' selected={false} sx={{ borderRadius: 5, pl: 2, pr: 2, height: '50px' }}
                    onClick={props.newTogo}>
                    New togo
                    <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                        <GiPaperBagFolded style={{ fontSize: 32, marginLeft: 3 }} />
                    </Box>
                </CategoryButton>
            </Box>
        </StyledPaper >);
}

export default Header;
