import { Box, Typography } from '@mui/material';
import React, { useContext, useState } from 'react';
import { NumPad } from '../my/my-component';
import { Customer, Receipt } from '../my/my-class';
import { FaGift } from 'react-icons/fa';
import { SYNC_TYPE, syncServer } from '../my/my-ws';

let CUSTOMER: Customer = {} as Customer;

export const receiveCustomer = (customer: Customer) => {
    CUSTOMER = customer;
}

export default function ({ receipt }: { receipt: Receipt }) {

    const [phone, setPhone] = useState('');

    const phoneX = phone.padEnd(10, 'x');
    const disableDone = phone.length < 10 && false;
    const newPoint = Math.floor(receipt?.finalTotal || 0);
    const point = (CUSTOMER.point || 0) + newPoint;

    const inputPhone = (input: string) => {
        if (phone.length > 10) return;
        setPhone(phone + input);
    }

    const submitPhone = () => {
        receipt.customer = new Customer(phone);
        syncServer(SYNC_TYPE.CUSTOMER, { phone, receiptId: receipt.id });
    }

    return (<Box>
        <Typography variant='h5' align="center" style={{ fontWeight: 'bold' }} sx={{ mt: 3, mr: 6 }}>
            Enter phone number to earn {newPoint} points today!
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
            <Box>
                <Typography variant='h4' align="center" style={{ fontWeight: 'bold' }} sx={{ m: 1 }}>
                    ({phoneX.substring(0, 3)}) {phoneX.substring(3, 6)} {phoneX.substring(6, 10)}
                </Typography>
                <NumPad clear={() => setPhone('')} input={inputPhone} done={submitPhone} disableDone={disableDone} doneRender={
                    <Typography variant="h6">
                        Gain reward
                    </Typography>} />
                <Box />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Box />
                <Box sx={{ m: 2, mr: '10px', mb: 0, mt: 0, }}>
                    <GiftIcon active={point > 100} />
                    <Box sx={{ height: '300px', display: 'flex', flexDirection: 'row', }}>
                        <Box sx={{
                            width: '35px', border: '1px solid',
                            display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
                        }}>
                            <Box />
                            <Box sx={{ height: `${3 * point}px`, display: 'flex', backgroundColor: '#ffebee', flexDirection: 'column', alignItems: 'center' }}>
                                {newPoint}
                                {CUSTOMER.point && <Box sx={{ justifyItems: 'center' }}>
                                    <Box>+</Box>
                                    <Box>{CUSTOMER.point}</Box>
                                </Box>}
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <Box>100</Box>
                            <Box sx={{ ml: '2px' }}>50</Box>
                            <Box sx={{ ml: '2px' }}>0</Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    </Box>);
}

const GiftIcon = ({ active }: { active: boolean }) => {
    return (
        <Box
            sx={{
                "@keyframes ani": {
                    "0%": {
                        transform: "translateY(10px)",
                    },
                    "100%": {
                        transform: "translateY(-15px) scale(1.5)",
                    },
                },
            }}>
            <FaGift style={{ fontSize: 35, animation: `${active ? 'ani' : ''} 1.5s ease-out forwards infinite`, }} />
        </Box>

    );
}
