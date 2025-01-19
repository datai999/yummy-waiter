import React, { useContext, useEffect, useState } from 'react';

import {
    Box,
    Paper,
    styled,
    Typography,
} from '@mui/material';

import YummyLogo from '../assets/yummy.png';
import { AuthContext } from '../App';
import { DatePicker } from '@mui/x-date-pickers';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import dayjs, { Dayjs } from 'dayjs';

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

const Header = (props: {
    setHistoryOrder: (state: boolean) => void,
    historyDate: Date,
    setHistoryDate: (date: Date) => void,
}) => {
    const { auth } = useContext(AuthContext);

    const handleDateChange = (date: Dayjs | null) => {
        date = date || dayjs();
        props.setHistoryDate(date.toDate());
    };

    return (
        <StyledPaper sx={{ display: 'flex', direction: 'row', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', direction: 'row', alignItems: 'center' }}>
                <LogoImage src={YummyLogo} alt="Yummy Logo" sx={{ display: { xs: 'none', sm: 'block' } }} onClick={() => props.setHistoryOrder(false)} />
                <LogoImageXS src={YummyLogo} alt="Yummy Logo" sx={{ display: { xs: 'block', sm: 'none' } }} onClick={() => props.setHistoryOrder(false)} />
                <Typography fontWeight='fontWeightMedium' variant="h4" sx={{ textAlign: "center", display: 'flex', ml: 1 }}>
                    Yummy Phở 2
                </Typography>
                <Typography fontWeight='fontWeightMedium' variant="h5" sx={{ textAlign: "center", display: 'flex', ml: 1, mt: 1 }}>
                    : {auth.name}
                </Typography>
            </Box>
            <DatePicker label="History date" sx={{ mt: 2 }} slotProps={{ textField: { size: 'small' } }}
                maxDate={dayjs()} value={dayjs(props.historyDate)} onChange={handleDateChange} />
        </StyledPaper >);
}

export default Header;
