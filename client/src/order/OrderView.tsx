import { Box, Button, Divider, TextField, useMediaQuery, useTheme } from "@mui/material";
import React, { createContext, useContext, useState } from "react";
import { CategoryItem, Receipt } from "../my/my-class";
import BagDnd from "./BagDnd";
import { CONTEXT } from "../App";
import { StyledPaper } from "../my/my-styled";
import { MdManageHistory } from "react-icons/md";

interface OrderContext {
    refreshOrderView: () => void;
    expand: boolean;
    discount: boolean;
    viewOnly?: boolean;
}

export const ORDER_CONTEXT = createContext<OrderContext>({ refreshOrderView: () => { }, expand: true, discount: false, viewOnly: true })

export default function OrderView(props: {
    note?: string,
    setNote?: (newNote: string) => void,
    bags: Map<number, Map<string, CategoryItem>>,
    phoId: String;
    showPho?: (isPho: boolean, bag: number, category: string, trackIndex: number, itemId: string) => void,
    discountPercent?: number, discountSubtract?: number
}) {
    const theme = useTheme();
    const { table, order } = useContext(CONTEXT.Order);
    const lockedTable = Boolean(useContext(CONTEXT.LockedTable)(table.id));

    const [refresh, setRefresh] = useState<Boolean>(false);
    const [expand, setExpand] = useState<boolean>(true);

    const mdSize = useMediaQuery('(min-width:900px)');
    const contextValue = { refreshOrderView: () => setRefresh(!refresh), expand, discount: false, viewOnly: true };

    return (<Box>
        {props.showPho && <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '95%' }}>
            <TextField
                label="Customer name, phone, pickup time, reserved, ..."
                size='small'
                fullWidth
                sx={{ mt: 1, mb: 0.5, ml: 1, mr: 2 }}
                disabled={lockedTable}
                value={props.note}
                onChange={(e) => props.setNote ? props.setNote(e.target.value) : null}
            />
            <Button onClick={() => setExpand(!expand)} size="medium" variant="outlined"
                sx={{ p: 0, pt: '2px', pb: '2px', mt: 1, borderRadius: 2, backgroundColor: expand ? theme.palette.text.primary : "#fff", color: expand ? '#fff' : theme.palette.text.primary }} >
                <MdManageHistory style={{ fontSize: 28, minHeight: '24px' }} />
            </Button>
        </Box>}
        <ORDER_CONTEXT.Provider value={contextValue}>
            <BagDnd bags={props.bags} phoId={props.phoId} showPho={props.showPho} />
        </ORDER_CONTEXT.Provider>
        <Box sx={{ display: 'flex', flexDirection: 'row-reverse', }}>
            <TotalBill bags={props.bags} discountPercent={props.discountPercent} discountSubtract={props.discountSubtract} />
        </Box>
    </Box >)
}

export const TotalBill = (props: { bags: Map<number, Map<string, CategoryItem>>, discountPercent?: number, discountSubtract?: number }) => {
    const { order } = useContext(CONTEXT.Order);
    const receipt: Receipt = new Receipt('', order).calculateTotal(props.bags, props.discountPercent, props.discountSubtract);

    return (<StyledPaper sx={{ p: 1, pb: 0, pt: 0, m: 0, ml: 1, mr: 1, minWidth: '160px', maxWidth: '200px', maxHeight: '150px' }}>
        {receipt.hasDiscount() && <>
            <Box sx={{ display: 'flex', direction: 'row', justifyContent: 'space-between' }}>
                <Box>
                    {`Sub total:`}
                </Box>
                <Box>
                    {receipt.subTotal.toFixed(2)}
                </Box>
            </Box>
            {receipt.discountPercent && <Box sx={{ display: 'flex', direction: 'row', justifyContent: 'space-between' }}>
                <Box>
                    {`Discount:${receipt.discountPercent.discount}%`}
                </Box>
                <Box>
                    -{receipt.discountPercent.amount!.toFixed(2)}
                </Box>
            </Box>}
            {receipt.discountSubtract && <Box sx={{ display: 'flex', direction: 'row', justifyContent: 'space-between' }}>
                <Box>
                    {`Discount:`}
                </Box>
                <Box>
                    -{receipt.discountSubtract.amount!.toFixed(2)}
                </Box>
            </Box>}
            <Divider />
        </>}
        <Box sx={{ display: 'flex', direction: 'row', justifyContent: 'space-between' }}>
            <Box>
                {`Total:`}
            </Box>
            <Box>
                {receipt.total.toFixed(2)}
            </Box>
        </Box>
        <Box sx={{ display: 'flex', direction: 'row', justifyContent: 'space-between' }}>
            <Box>
                {`Tax:`}
            </Box>
            <Box>
                {receipt.tax.toFixed(2)}
            </Box>
        </Box>
        <Box sx={{ display: 'flex', direction: 'row', justifyContent: 'space-between' }}>
            <Box>
                {`Final total:`}
            </Box>
            <Box>
                {receipt.finalTotal.toFixed(2)}
            </Box>
        </Box>
    </StyledPaper>)
}
