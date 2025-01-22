import { Box, Button, TextField, useMediaQuery } from "@mui/material";
import React, { createContext, useContext, useState } from "react";
import { CategoryItem } from "../my/my-class";
import BagDnd from "./BagDnd";
import { CONTEXT } from "../App";
import { StyledPaper } from "../my/my-styled";
import { SERVICE } from "../my/my-service";
import { BsArrowsCollapse, BsArrowsExpand } from "react-icons/bs";
import { MdManageHistory } from "react-icons/md";

interface OrderContext {
    refreshOrderView: () => void;
    expand: boolean;
}

export const ORDER_CONTEXT = createContext<OrderContext>({ refreshOrderView: () => { }, expand: true })

export default function OrderView(props: {
    note?: string,
    setNote?: (newNote: string) => void,
    bags: Map<number, Map<string, CategoryItem>>,
    phoId: String;
    showPho?: (isPho: boolean, bag: number, category: string, trackIndex: number, itemId: string) => void,
}) {
    const { table } = useContext(CONTEXT.Table);
    const lockedTable = Boolean(useContext(CONTEXT.LockedTable)(table.id));

    const [refresh, setRefresh] = useState<Boolean>(false);
    const [expand, setExpand] = useState<boolean>(true);

    const mdSize = useMediaQuery('(min-width:900px)');
    const contextValue = { refreshOrderView: () => setRefresh(!refresh), expand };

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
                sx={{ pl: 0, pr: 0, borderRadius: 2, backgroundColor: expand ? '#d32f2f' : "#fff", color: expand ? '#fff' : "#d32f2f" }} >
                <MdManageHistory style={{ fontSize: 18, minHeight: '24px' }} />
            </Button>
        </Box>}
        <ORDER_CONTEXT.Provider value={contextValue}>
            <BagDnd bags={props.bags} phoId={props.phoId} showPho={props.showPho} />
        </ORDER_CONTEXT.Provider>
        <Box sx={{ display: 'flex', flexDirection: 'row-reverse', }}>
            <TotalBill bags={props.bags} />
        </Box>
    </Box >)
}

export const TotalBill = (props: { bags: Map<number, Map<string, CategoryItem>> }) => {
    const receipt = SERVICE.calculateTotal(props.bags);

    return (<StyledPaper sx={{ p: 1, pb: 0, pt: 0, m: 0, ml: 1, mr: 1, minWidth: '160px', maxWidth: '200px', maxHeight: '70px' }}>
        <Box sx={{ display: 'flex', direction: 'row', justifyContent: 'space-between' }}>
            <Box>
                {`Sub total:`}
            </Box>
            <Box>
                {receipt.subTotal.toFixed(2)}
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
                {`Total:`}
            </Box>
            <Box>
                {receipt.total.toFixed(2)}
            </Box>
        </Box>
    </StyledPaper>)
}
