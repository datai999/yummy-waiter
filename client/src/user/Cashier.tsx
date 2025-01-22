import { Modal, Box, Typography, styled, TextField, Button, Stack, Badge } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { CONTEXT, TableContext } from "../App";
import OrderView, { ORDER_CONTEXT, TotalBill } from "../order/OrderView";
import { CategoryItem, LockedTable, Order, Receipt, Table } from "../my/my-class";
import { NumPad } from "../my/my-component";
import { SERVICE } from "../my/my-service";
import { RxExit } from "react-icons/rx";
import { MdOutlineCallSplit } from "react-icons/md";
import { TableStatus } from "../my/my-constants";
import { syncServer, SYNC_TYPE } from "../my/my-ws";
import BagDnd from "../order/BagDnd";
import { IoPrint } from "react-icons/io5";
import { AiOutlineFileDone } from "react-icons/ai";
import { IoMdClose } from "react-icons/io";
import { BsCashCoin } from "react-icons/bs";
import { TbBasketDiscount } from "react-icons/tb";

export default function Cashier(props: {
    view: boolean,
    close: () => void,
    orders: Map<String, Table>,
    note: string,
    bags: Map<number, Map<string, CategoryItem>>
}) {
    const { auth } = useContext(CONTEXT.Auth);
    const { order, setOrder } = useContext(CONTEXT.Order);
    const [tendered, setTendered] = useState('');
    const [expand, setExpand] = useState<boolean>(false);

    useEffect(() => {
        setTendered('');
    }, [props.view]);

    const receipt: Receipt = new Receipt(auth.name, order).calculateTotal(props.bags);
    const numTendered = Number(tendered) / 100;
    const change = numTendered - receipt.total;

    const onInput = (key: string) => {
        if (tendered.length > 4) return;
        setTendered(tendered + key);
    }

    const checkTendered = () => {
        if (numTendered < receipt.total) {
            alert('Amount not enough');
            return;
        }
        receipt.tendered = numTendered;
        receipt.change = change;
        if (props.note !== (receipt.note || '')) {
            receipt.note = props.note;
        }
        receipt.cleanTime = new Date();
        receipt.status = TableStatus.DONE;
        receipt.bags = SERVICE.cleanBags(receipt.bags).cleanBags;

        if (receipt.id.startsWith('Togo')) props.orders.delete(receipt.id);
        else props.orders.set(receipt.id, new Order(receipt.id));
        syncServer(SYNC_TYPE.LOCKED_TABLES, { [order.id]: new LockedTable(false, auth.name) });
        syncServer(SYNC_TYPE.DONE_ORDER, { [order.id]: receipt });
        setOrder(null);
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
                                <Typography variant="h4" sx={{ mb: 2 }}>{order.getName()}</Typography>
                                {props.note && <Typography variant="h6" sx={{ mt: '10px' }}>: {props.note}</Typography>}
                            </Box>
                            <TableContext.Provider value={{ table: order, order: order, orderTable: () => { }, setOrder: () => { }, prepareChangeTable: () => { } }}>
                                <ORDER_CONTEXT.Provider value={{ refreshOrderView: () => { }, expand, discount: true }}>
                                    <BagDnd bags={props.bags} phoId={''} />
                                </ORDER_CONTEXT.Provider>
                            </TableContext.Provider>
                            <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                                {`Discount: `}
                                <Box sx={{ display: 'flex', flexDirection: 'column', }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                                        {[10, 25, 50, '?'].map(discountPecent => <Button
                                            key={discountPecent}
                                            variant="outlined"
                                            color="primary"
                                            onMouseDown={() => setTendered(discountPecent + '00')}
                                            fullWidth
                                            sx={{ maxHeight: '35px', width: '50px', mb: 1, borderRadius: '16px', display: 'flex', flexDirection: 'row-reverse' }}
                                        >
                                            <Typography variant="caption">
                                                {discountPecent}%
                                            </Typography>
                                        </Button>)}
                                    </Box>
                                    <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                                        {[1, 2, 4, '?'].map(discountSubtract => <Button
                                            key={discountSubtract}
                                            variant="outlined"
                                            color="primary"
                                            onMouseDown={() => setTendered(discountSubtract + '00')}
                                            fullWidth
                                            sx={{ maxHeight: '35px', width: '50px', mb: 1, borderRadius: '16px', display: 'flex', flexDirection: 'row-reverse' }}
                                        >
                                            <Typography variant="caption">
                                                ${discountSubtract}
                                            </Typography>
                                        </Button>)}
                                    </Box>
                                </Box>
                                <TotalBill bags={receipt.bags} />
                            </Box>
                        </Box>

                        <Box sx={{ witdh: '300px', maxWidth: '300px' }}>
                            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', mb: 0 }}>
                                <Badge badgeContent={<Box sx={{ ml: 8, bgcolor: '#fff', fontSize: 14 }}>Tendered</Box>} anchorOrigin={{ vertical: 'top', horizontal: 'left', }} >
                                    <Typography variant="h4" sx={{ display: 'flex', flexDirection: 'row-reverse', mb: 2, p: 1, border: 'solid 1px', borderRadius: 2, minHeight: '45px', minWidth: '130px' }}>
                                        {(Number(tendered) / 100).toFixed(2)}
                                    </Typography>
                                </Badge>
                                <Badge badgeContent={<Box sx={{ ml: 8, bgcolor: '#fff', fontSize: 14 }}>Change</Box>} anchorOrigin={{ vertical: 'top', horizontal: 'left', }} >
                                    <Typography variant="h4" sx={{ display: 'flex', flexDirection: 'row-reverse', mb: 2, p: 1, border: 'solid 1px', borderRadius: 2, minHeight: '45px', minWidth: '130px' }}>
                                        {change.toFixed(2)}
                                    </Typography>
                                </Badge>
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
                                    onMouseDown={() => setTendered(index === 4 ? (Number(receipt.total) * 100 + '') : suggestTendered + '00')}
                                    fullWidth
                                    sx={{ minHeight: 70, maxHeight: 5, width: '90px', mb: 1, borderRadius: '16px', display: 'flex', flexDirection: 'row-reverse' }}
                                >
                                    <Typography variant="h5">
                                        ${suggestTendered}
                                    </Typography>
                                </Button>)}
                        </Box>
                    </Box>

                    <Stack direction="row" spacing={4} sx={{
                        mt: 2,
                        justifyContent: "center",
                        alignItems: "stretch",
                    }}>
                        <Button variant="contained" color="primary" sx={{ minHeight: 50 }} onClick={props.close} >
                            Close
                            <IoMdClose style={iconStyle} />
                        </Button>
                        <Button variant="contained" color="primary" sx={{ minHeight: 50 }} onClick={() => alert('TODO')} >
                            Split bill
                            <MdOutlineCallSplit style={iconStyle} />
                        </Button>
                        {/* <Button variant="contained" color="primary" sx={{ minHeight: 50 }} onClick={() => alert('TODO')} >
                            Discount
                            <TbBasketDiscount style={iconStyle} />
                        </Button> */}
                        <Button variant="contained" color="primary" onClick={() => { }} >
                            Receipt
                            <IoPrint style={iconStyle} />
                        </Button>
                        <Button variant="contained" color="primary" onClick={checkTendered} >
                            Cash
                            <BsCashCoin style={iconStyle} />
                        </Button>
                    </Stack>
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