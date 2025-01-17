import React, { useState } from 'react';

import YummyLogoCut from '../assets/yummy_cut.png';
import { Box, Button, Grid2, Stack, styled, Typography } from '@mui/material';

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

    const inputKey = (key: string) => {
        console.log(code);
        if (key === 'x') code = '';
        else if (key !== '->') code += key;
        else {
            const user = users[code];
            if (!user) {
                alert('Access code is invalid');
            } else props.setAuth({ ...user, code: code });
            code = '';
        }

    }

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
            <Grid2 container spacing={1} sx={{ maxWidth: 500 }}>
                {['7', '8', '9', '4', '5', '6', '1', '2', '3', 'x', '0'].map(key =>
                    <Grid2 key={key} size={4}>
                        <Button
                            variant="outlined"
                            color="primary"
                            onTouchStart={() => inputKey(key)}
                            fullWidth
                            sx={{ minHeight: 70, maxHeight: 5, borderRadius: '32px' }}
                        >
                            <Typography variant="h5">
                                {key}
                            </Typography>
                        </Button>
                    </Grid2>)}
                <Grid2 size={4}>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => inputKey('->')}
                        fullWidth
                        sx={{ minHeight: 70, maxHeight: 5, borderRadius: '32px' }}
                    >
                        <Typography variant="h5">
                            {'->'}
                        </Typography>
                    </Button>
                </Grid2>
            </Grid2>
        </Stack>
    </Box>
    );
}
