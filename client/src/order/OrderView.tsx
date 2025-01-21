import { Box, TextField, useMediaQuery } from "@mui/material";
import React, { useContext } from "react";
import { CategoryItem } from "../my/my-class";
import BagDnd from "./BagDnd";
import { CONTEXT } from "../App";
import { StyledPaper } from "../my/my-styled";

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

    return (<Box>
        <BagDnd bags={props.bags} phoId={props.phoId} showPho={props.showPho} />
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

    const subTotal: number = Array.from(props.bags.values()).reduce((acc, categotyItems) => {
        return acc + Array.from(categotyItems.values()).reduce((subAcc, categotyItem) => {
            const phoTotal = categotyItem.pho.reduce((trackedAcc, tracked) => {
                return trackedAcc + Array.from(tracked.items.values())
                    .reduce((phoAcc, pho) => phoAcc + pho.actualQty * pho.price, 0)
            }, 0);
            const nonPhoTotal = categotyItem.nonPho.reduce((trackedAcc, tracked) => {
                return trackedAcc + Array.from(tracked.items.values())
                    .reduce((nonPhoAcc, nonPho) => nonPhoAcc + nonPho.actualQty * nonPho.price, 0)
            }, 0);
            return subAcc + phoTotal + nonPhoTotal;
        }, 0);
    }, 0);
    let tax: number = Math.ceil(0.0925 * subTotal * 100) / 100;

    return (<StyledPaper sx={{ p: 1, pb: 0, pt: 0, m: 0, ml: 1, minWidth: '140px', maxHeight: '70px' }}>
        <Box sx={{ display: 'flex', direction: 'row', justifyContent: 'space-between' }}>
            <Box>
                {`Sub total:`}
            </Box>
            <Box>
                {subTotal.toFixed(2)}
            </Box>
        </Box>
        <Box sx={{ display: 'flex', direction: 'row', justifyContent: 'space-between' }}>
            <Box>
                {`Tax:`}
            </Box>
            <Box>
                {tax.toFixed(2)}
            </Box>
        </Box>
        <Box sx={{ display: 'flex', direction: 'row', justifyContent: 'space-between' }}>
            <Box>
                {`Total:`}
            </Box>
            <Box>
                {(subTotal + tax).toFixed(2)}
            </Box>
        </Box>
    </StyledPaper>)
}
