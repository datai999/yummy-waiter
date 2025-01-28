import React, { useContext } from 'react';

import {
    Box,
} from '@mui/material';

import YummyLogo from '../assets/yummy.png';
import { CategoryButton } from '../my/my-styled';
import { GiPaperBagFolded } from 'react-icons/gi';
import { AuthContext } from '../App';
import { MdManageHistory, MdOutlineSettings } from 'react-icons/md';
import { BiFoodMenu } from "react-icons/bi";
import { COMPONENT } from '../my/my-component';
import { IoIosPeople } from 'react-icons/io';
import { SCREEN } from '../my/my-constants';

const Header = (props: {
    routeScreen: (screen: SCREEN) => void,
    newTogo: () => void
}) => {
    const { auth, logout } = useContext(AuthContext);

    const isManager = true;

    return (<COMPONENT.Header back={logout} actions={<Box sx={{ mt: '2px' }}>
        {isManager && <>
            <CategoryButton variant="outlined" size='large' selected={false} sx={{ borderRadius: 5, pl: 2, pr: 2, mr: 1, height: '50px' }}
                onClick={() => props.routeScreen(SCREEN.SERVER)}>
                Servers
                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                    <IoIosPeople style={{ fontSize: 25, marginLeft: 3 }} />
                </Box>
            </CategoryButton>
            <CategoryButton variant="outlined" size='large' selected={false} sx={{ borderRadius: 5, pl: 2, pr: 2, mr: 1, height: '50px' }}
                onClick={() => props.routeScreen(SCREEN.MENU)}>
                Menu
                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                    <BiFoodMenu style={{ fontSize: 25, marginLeft: 3 }} />
                </Box>
            </CategoryButton>
        </>}
        <CategoryButton variant="outlined" size='large' selected={false} sx={{ borderRadius: 5, pl: 2, pr: 2, mr: 1, height: '50px' }}
            onClick={() => props.routeScreen(SCREEN.HISTORY_ORDER)}>
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
    </Box>} />);
}

export default Header;
