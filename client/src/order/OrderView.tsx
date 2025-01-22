import { Box, TextField, useMediaQuery } from "@mui/material";
import React, { createContext, useContext, useState } from "react";
import { CategoryItem } from "../my/my-class";
import BagDnd from "./BagDnd";
import { CONTEXT } from "../App";
import { StyledPaper } from "../my/my-styled";
import { SERVICE } from "../my/my-service";

export const ORDER_CONTEXT = {
    refresh: createContext(() => { })
}

export default function OrderView(props: {
    note?: string,
    setNote?: (newNote: string) => void,
    bags: Map<number, Map<string, CategoryItem>>,
    phoId: String;
    showPho?: (isPho: boolean, bag: number, category: string, trackIndex: number, itemId: string) => void,
}) {
    const { table } = useContext(CONTEXT.Table);
    const lockedTable = Boolean(useContext(CONTEXT.LockedTable)(table.id));
    const mdSize = useMediaQuery('(min-width:900px)');

    const [refresh, setRefresh] = useState<Boolean>(false);

    return (<Box>
        <ORDER_CONTEXT.refresh.Provider value={() => setRefresh(!refresh)}>
            <BagDnd bags={props.bags} phoId={props.phoId} showPho={props.showPho} />
        </ORDER_CONTEXT.refresh.Provider>
        <Box sx={{ display: 'flex', direction: 'row', justifyContent: 'space-around' }}>
            <TextField
                label="Customer name, phone, pickup time, reserved, ..."
                size='small'
                sx={{ mt: 1, mb: 1, ml: 1, width: '95%' }}
                multiline
                rows={2}
                disabled={lockedTable || !props.showPho}
                value={props.note}
                onChange={(e) => props.setNote ? props.setNote(e.target.value) : null}
            />
            <TotalBill bags={props.bags} />
        </Box >
    </Box>)
}

const TotalBill = (props: { bags: Map<number, Map<string, CategoryItem>> }) => {
    const receipt = SERVICE.calculateTotal(props.bags);

    return (<StyledPaper sx={{ p: 1, pb: 0, pt: 0, m: 0, ml: 1, minWidth: '140px', maxHeight: '70px' }}>
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
