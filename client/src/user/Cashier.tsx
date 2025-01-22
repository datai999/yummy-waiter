import { Modal, Box, Typography, styled, TextField, Button, Stack } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { CONTEXT, TableContext } from "../App";
import OrderView, { ORDER_CONTEXT, TotalBill } from "../order/OrderView";
import { CategoryItem, LockedTable, Table } from "../my/my-class";
import { NumPad } from "../my/my-component";
import { SERVICE } from "../my/my-service";
import { RxExit } from "react-icons/rx";
import { MdOutlineCallSplit } from "react-icons/md";
import { TableStatus } from "../my/my-constants";
import { syncServer, SYNC_TYPE } from "../my/my-ws";
import BagDnd from "../order/BagDnd";

export default function Cashier(props: {
    view: boolean,
    close: () => void,
    orders: Map<String, Table>,
    note: string,
    bags: Map<number, Map<string, CategoryItem>>
}) {
    const { auth } = useContext(CONTEXT.Auth);
    const { table, orderTable } = useContext(CONTEXT.Table);
    const [tendered, setTendered] = useState('');
    const [expand, setExpand] = useState<boolean>(false);

    useEffect(() => {
        setTendered('');
    }, [props.view]);

    const receipt = SERVICE.calculateTotal(props.bags);

    const onInput = (key: string) => {
        if (tendered.length > 4) return;
        setTendered(tendered + key);
    }

    const checkTendered = () => {
        const numTendered = Number(tendered) / 100;
        if (numTendered < receipt.total) {
            alert('Not enough');
            return;
        }
        if (props.note !== (table.note || '')) {
            table.note = props.note;
        }
        table.cashier = auth.name;
        table.cleanTime = new Date();
        table.status = TableStatus.DONE;
        table.bags = SERVICE.cleanBags(props.bags).cleanBags;
        table.receipts = [{ ...receipt, tendered: numTendered, change: receipt.total - numTendered }];
        if (table.id.startsWith('Togo')) props.orders.delete(table.id);
        else props.orders.set(table.id, new Table(table.id));
        syncServer(SYNC_TYPE.LOCKED_TABLES, { [table.id]: new LockedTable(false, auth.name) });
        syncServer(SYNC_TYPE.DONE_ORDER, { [table.id]: table });
        orderTable(null);
    }

    return (<Modal
        open={props.view}
        onClose={props.close}
    >
        <ModalContent>
            {props.view && (
                <Box>
                    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                        <Box sx={{ width: '500px' }}>
                            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                                <Typography variant="h4" sx={{ mb: 2 }}>{table.id}</Typography>
                                {props.note && <Typography variant="h6" sx={{ mt: '10px' }}>: {props.note}</Typography>}
                            </Box>
                            <TableContext.Provider value={{ table: table, orderTable: () => { }, prepareChangeTable: () => { } }}>
                                <ORDER_CONTEXT.Provider value={{ refreshOrderView: () => { }, expand }}>
                                    <BagDnd bags={props.bags} phoId={''} />
                                </ORDER_CONTEXT.Provider>
                            </TableContext.Provider>
                            <Box sx={{ display: 'flex', flexDirection: 'row-reverse', }}>
                                <TotalBill bags={props.bags} />
                            </Box>
                        </Box>
                        <Box sx={{ witdh: '300px', maxWidth: '300px' }}>
                            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', ml: 5, mb: 1 }}>
                                {/* <TotalBill bags={props.bags} /> */}
                                <Typography variant="h4" sx={{ display: 'flex', flexDirection: 'row-reverse', mb: 2, p: 1, border: 'solid 1px', borderRadius: 2, minHeight: '45px', minWidth: '130px' }}>
                                    {(Number(tendered) / 100).toFixed(2)}
                                </Typography>
                            </Box>
                            <NumPad clear={() => setTendered('')} input={onInput} done={checkTendered} />
                        </Box>
                        <Box sx={{ mt: 0.5 }}>
                            {['100', '50', '30', '20', receipt.total.toFixed(2)].map((suggestTendered, index) =>
                                <Button
                                    key={suggestTendered}
                                    variant="outlined"
                                    color="primary"
                                    disabled={Number(suggestTendered) < receipt.total}
                                    // onClick={() => inputKey(key)}
                                    onTouchStart={() => setTendered(index === 4 ? (Number(receipt.total) * 100 + '') : suggestTendered + '00')}
                                    fullWidth
                                    sx={{ minHeight: 70, maxHeight: 5, width: '90px', mb: 1, borderRadius: '16px', display: 'flex', flexDirection: 'row-reverse' }}
                                >
                                    <Typography variant="h5">
                                        ${suggestTendered}
                                    </Typography>
                                </Button>)}
                        </Box>
                    </Box>
                    {/* <Stack direction="row" spacing={3} sx={{
                        justifyContent: "center",
                        alignItems: "stretch",
                    }}>
                        <Button variant="contained" color="primary" sx={{ minHeight: 50 }} onClick={props.close} >
                            Cancel
                            <RxExit style={iconStyle} />
                        </Button>
                        <Button variant="contained" color="primary" sx={{ minHeight: 50 }} onClick={props.close} >
                            Split bill
                            <MdOutlineCallSplit  style={iconStyle} />
                        </Button>
                    </Stack> */}
                </Box>
            )}
        </ModalContent>
    </Modal>)
}

const ModalContent = styled(Box)({
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    minHeight: '450px',
    maxHeight: "600",
    width: "1000px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    padding: "20px",
    overflowY: "auto"
});

const iconStyle = {
    fontSize: 30, marginLeft: 8
}