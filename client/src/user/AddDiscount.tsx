import { Box, Typography, Button, useTheme } from '@mui/material';
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
    const [discountPercents, setDiscountPercent] = useState<number[]>([]);
    const [discountSubtracts, setDiscountSubtract] = useState<number[]>([]);
    const [customDiscountPercent, setCustomDiscountPercent] = useState<number>(0);
    const [customDiscountSubtract, setCustomDiscountSubtract] = useState<number>(0);

    useEffect(() => {
        setDiscountPercent([]);
        setDiscountSubtract([]);
    }, [props.view]);

    const onDiscount = (type: string, amount: number, discounts: number[], setDiscounts: (discounts: number[]) => void) => {
        const index = discounts.indexOf(amount);
        const nextDiscount = index === -1 ? [...discounts, amount] : discounts.filter((_, i) => i !== index);
        setDiscounts(nextDiscount);

        if (type === 'percent') props.receipt.calculateTotal(props.receipt.bags, nextDiscount, discountSubtracts);
        else props.receipt.calculateTotal(props.receipt.bags, discountPercents, nextDiscount);

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
        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
            {`Discount: `}
            <Box sx={{ display: 'flex', flexDirection: 'column', }}>
                <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                    {[customDiscountPercent, 10, 25, 50].map((discountPecent, index) => <Button
                        key={discountPecent}
                        variant="outlined"
                        color="primary"
                        onMouseDown={() => onDiscount('percent', discountPecent, discountPercents, setDiscountPercent)}
                        fullWidth
                        sx={{
                            backgroundColor: discountPercents.includes(discountPecent) ? theme.palette.primary.main : "#fff",
                            color: discountPercents.includes(discountPecent) ? "#fff" : theme.palette.text.primary,
                            maxHeight: '35px', width: '50px', mb: 1, borderRadius: '16px', display: 'flex', flexDirection: 'row-reverse'
                        }}
                    >
                        <Typography variant="caption">
                            {index === 0 && discountPecent === 0 ? '?' : discountPecent}%
                        </Typography>
                    </Button>)}
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                    {[customDiscountSubtract, 1, 2, 4].map((discountSubtract, index) => <Button
                        key={discountSubtract}
                        variant="outlined"
                        color="primary"
                        onMouseDown={() => onDiscount('subtract', discountSubtract, discountSubtracts, setDiscountSubtract)}
                        fullWidth
                        sx={{
                            backgroundColor: discountSubtracts.includes(discountSubtract) ? theme.palette.primary.main : "#fff",
                            color: discountSubtracts.includes(discountSubtract) ? "#fff" : theme.palette.text.primary,
                            maxHeight: '35px', width: '50px', mb: 1, borderRadius: '16px', display: 'flex', flexDirection: 'row-reverse'
                        }}
                    >
                        <Typography variant="caption">
                            ${index === 0 && discountSubtract === 0 ? '?' : discountSubtract}
                        </Typography>
                    </Button>)}
                </Box>
            </Box>
            <TotalBill bags={props.receipt.bags} discountPercents={discountPercents} discountSubtracts={discountSubtracts} />
        </Box>
    </Box>);
}