import React, { useState } from 'react';

import YummyLogoCut from '../assets/yummy_cut.png';
import { Box, Button, Grid2, Stack, styled, Typography } from '@mui/material';
import { NumPad } from '../my/my-component';

const LogoImage = styled("img")({
    width: "160px",
    height: "160px",
    objectFit: "contain",
    marginLeft: '-40px'
});

export default function Login(props: {
    setAuth: (user: any) => void
}) {

    let code = '';

    const users = JSON.parse(localStorage.getItem('users')!);

    const login = () => {
        const user = users[code];
        if (!user) {
            alert('Access code is invalid');
        } else props.setAuth({ ...user, code: code });
        code = '';
    }

    // login();

    return (<Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
    >
        <Stack direction="column" alignItems="center" spacing={1} mb={20}>
            <Stack direction="row" >
                <LogoImage src={YummyLogoCut} alt="Yummy Logo" sx={{ display: { xs: 'none', sm: 'block' } }} />
                <Typography mt='70px' ml='-65px' fontWeight='fontWeightMedium' variant="h3" sx={{ textAlign: "center", display: 'flex', color: '#D22D44' }}>
                    ummy Phở 2
                </Typography>
            </Stack>
            <NumPad clear={() => code = ''} input={(key: string) => code += key} done={login} />
        </Stack>
    </Box>
    );
}
