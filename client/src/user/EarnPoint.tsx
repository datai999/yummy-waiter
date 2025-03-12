import { Box, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { NumPad } from '../my/my-component';
import { Customer, Receipt } from '../my/my-class';
import { FaGift } from 'react-icons/fa';
import { SYNC_TYPE, syncServer } from '../my/my-ws';

export const receiveCustomer = (customer: Customer) => {
    onReceiveCustomer(customer);
}

let onReceiveCustomer: (customer: Customer) => void = () => console.log('error');

export default function ({ receipt, resetTimer }: { receipt: Receipt, resetTimer: () => void }) {

    const [customer, setCustomer] = useState<Customer>(receipt.customer || {} as Customer);
    const [phone, setPhone] = useState(receipt.customer?.phone || '');

    const phoneX = phone.padEnd(10, 'x');
    const disableDone = phone.length < 10 && false;
    const newPoint = receipt.point;
    const point = (customer.prePoint || 0) + newPoint;

    const phoneValid = true || phone.length == 10;

    useEffect(() => {
        setCustomer(receipt.customer || {} as Customer);
        setPhone(receipt.customer?.phone || '');
    }, [receipt.id]);

    onReceiveCustomer = (newCustomer: Customer) => {
        receipt.customer = newCustomer;
        // syncServer(SYNC_TYPE.ACTIVE_TABLES, { [receipt.id]: receipt });
        setCustomer(newCustomer);
        setPhone(newCustomer?.phone || '');
    }

    const inputPhone = (input: string) => {
        if (phone.length > 10) return;
        setPhone(phone + input);
        resetTimer();
    }

    const submitPhone = () => {
        if (!phoneValid) return;
        receipt.customer = new Customer(phone);
        syncServer(SYNC_TYPE.GET_CUSTOMER, { phone, newPoint, receipt: receipt });
    }

    return (<Box width='585px'>
        {customer.phone
            ? (<Typography variant='h4' align="center" style={{ fontWeight: 'bold' }} sx={{ mt: 2, mr: 6 }}>
                Thank you !!!
            </Typography>)
            : (<Typography variant='h5' align="center" style={{ fontWeight: 'bold' }} sx={{ mt: 3, mr: 6 }}>
                Enter phone number to earn {newPoint} points today!
            </Typography>)}

        <Box width='585px' sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <Box>
                <Typography variant='h4' align="center" style={{ fontWeight: 'bold' }} sx={{ m: 1 }}>
                    ({phoneX.substring(0, 3)}) {phoneX.substring(3, 6)} {phoneX.substring(6, 10)}
                </Typography>
                {!customer.phone
                    ? (<NumPad clear={() => setPhone('')} input={inputPhone} done={submitPhone} disableDone={disableDone} doneRender={
                        <Typography variant="h6">
                            Gain reward
                        </Typography>} />)
                    : (<Box height="180px" width="496px" sx={{ diplay: 'flex', justifyItems: 'center' }}>
                        <Box width='180px' sx={{ mt: 4 }}>
                            <Box sx={SX}>
                                <Box>
                                    {`Previous points:`}
                                </Box>
                                <Box>
                                    {customer.prePoint}
                                </Box>
                            </Box>
                            <Box sx={SX}>
                                <Box>
                                    {`New points:`}
                                </Box>
                                <Box>
                                    {newPoint}
                                </Box>
                            </Box>
                            <Box sx={SX}>
                                <Box>
                                    {`Total points:`}
                                </Box>
                                <Box>
                                    {point}
                                </Box>
                            </Box>
                        </Box>
                        <Typography variant='h5' align="center" style={{ fontWeight: 'bold' }} sx={{ mt: 3 }}>
                            {point >= 100
                                ? 'Congratulation! You can have a reward!'
                                : `You need ${(100 - point).toFixed(0)} points to gain a reward.`}
                        </Typography>
                    </Box>)}
                <Box />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Box />
                <Box sx={{ m: 2, mr: '10px', mb: 0, mt: 0, }}>
                    <GiftIcon active={point >= 100} />
                    <Box sx={{ height: '300px', display: 'flex', flexDirection: 'row', }}>
                        <Box sx={{
                            width: '35px', border: '1px solid',
                            display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
                        }}>
                            <Box />
                            <Box sx={{ height: `${3 * point}px`, display: 'flex', backgroundColor: '#ffebee', flexDirection: 'column', alignItems: 'center' }}>
                                {newPoint}
                                {customer.point && <Box sx={{ justifyItems: 'center' }}>
                                    <Box>+</Box>
                                    <Box>{customer.prePoint}</Box>
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

const SX = { display: 'flex', direction: 'row', justifyContent: 'space-between', fontSize: '20px', fontWeight: "bold" }

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
