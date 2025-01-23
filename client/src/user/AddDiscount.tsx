import { Box, Typography, Button, useTheme, TextField, InputAdornment } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { CONTEXT } from '../App';
import BagDnd from '../order/BagDnd';
import { ORDER_CONTEXT, TotalBill } from '../order/OrderView';
import { Receipt } from '../my/my-class';

export default function AddDiscount(props: {
    view: boolean,
    addDiscount: () => void,
    receipt: Receipt
}) {
    const theme = useTheme();
    const [percent, setPercent] = useState<number>(0);
    const [subtract, setSubtract] = useState<number>(0);

    useEffect(() => {
        setPercent(0);
        setSubtract(0);
    }, [props.view]);

    const onDiscount = (type: string, amount: number) => {
        if (type === 'percent') {
            setPercent(amount);
            props.receipt.calculateTotal(props.receipt.bags, amount, subtract);
        }
        else {
            setSubtract(amount);
            props.receipt.calculateTotal(props.receipt.bags, percent, amount)
        };
        props.addDiscount();
    }

    return (<Box sx={{ width: '500px' }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
            <Typography variant="h4" sx={{ mb: 2 }}>{props.receipt.getName()}</Typography>
            {props.receipt.note && <Typography variant="h6" sx={{ mt: '10px' }}>: {props.receipt.note}</Typography>}
        </Box>
        <CONTEXT.Table.Provider value={{ table: props.receipt, order: props.receipt, orderTable: () => { }, setOrder: () => { }, prepareChangeTable: () => { } }}>
            <ORDER_CONTEXT.Provider value={{ refreshOrderView: () => { }, expand: false, discount: true }}>
                <BagDnd bags={props.receipt.bags} phoId={''} />
            </ORDER_CONTEXT.Provider>
        </CONTEXT.Table.Provider>
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            {/* {`Discount: `} */}
            <Box sx={{ display: 'flex', flexDirection: 'column', }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', mt: '2px' }}>
                    <DiscountInput label={'% Discount'} value={percent} onChange={(num) => onDiscount('percent', num)} />
                    {[10, 25, 50].map((discountPecent) => <Button
                        key={discountPecent}
                        variant="outlined"
                        color="primary"
                        onMouseDown={() => onDiscount('percent', percent === discountPecent ? 0 : discountPecent)}
                        fullWidth
                        sx={{
                            backgroundColor: percent === discountPecent ? theme.palette.primary.main : "#fff",
                            color: percent === discountPecent ? "#fff" : theme.palette.text.primary,
                            maxHeight: '35px', width: '50px', mr: 1, borderRadius: '16px', display: 'flex', flexDirection: 'row-reverse'
                        }}
                    >
                        <Typography variant="caption">
                            {discountPecent}%
                        </Typography>
                    </Button>)}
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'row', mt: 1 }}>
                    <DiscountInput label={'Sub-Discount'} value={subtract} onChange={(num) => onDiscount('subtract', num)} />
                    {[2, 4, 8].map((discountSubtract) => <Button
                        key={discountSubtract}
                        variant="outlined"
                        color="primary"
                        onMouseDown={() => onDiscount('subtract', subtract === discountSubtract ? 0 : discountSubtract)}
                        fullWidth
                        sx={{
                            backgroundColor: subtract === discountSubtract ? theme.palette.primary.main : "#fff",
                            color: subtract === discountSubtract ? "#fff" : theme.palette.text.primary,
                            maxHeight: '35px', width: '50px', mr: 1, borderRadius: '16px', display: 'flex', flexDirection: 'row-reverse'
                        }}
                    >
                        <Typography variant="caption">
                            ${discountSubtract}
                        </Typography>
                    </Button>)}
                </Box>
            </Box>
            <TotalBill bags={props.receipt.bags} discountPercent={percent} discountSubtract={subtract} />
        </Box>
    </Box>);
}

const DiscountInput = (props: { label: string, value: number, onChange: (num: number) => void }) => {
    return (<TextField margin="none" size='small'
        type='number'
        label={props.label}
        inputProps={{ inputMode: 'numeric', style: { fontSize: 14, textAlign: 'center' }, }}
        InputProps={{
            type: "number",
            sx: {
                '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                    display: 'none'
                },
                '& input[type=number]': {
                    MozAppearance: 'textfield'
                },
            }
        }}
        fullWidth={true}
        sx={{
            p: 0, m: 0, mr: 1, maxWidth: '100px',
            textAlign: 'center',
            input: {
                color: 'primary',
                "&::placeholder": {
                    opacity: 1,
                },
            },
            "& fieldset": { border: '' },
        }}
        slotProps={{
            input: {
                startAdornment: props.label !== '% Discount' ? <InputAdornment position="start" sx={{ m: 0, p: 0 }}>$</InputAdornment> : '',
                endAdornment: props.label === '% Discount' ? <InputAdornment position="end" sx={{ m: 0, p: 0 }}>%</InputAdornment> : '',
            },
        }}
        // placeholder={props.value.toString()}
        value={props.value}
        onChange={(e) => {
            const num = Number(e.target.value);
            if (num > 100) return;
            props.onChange(num);
        }}
    />);
}