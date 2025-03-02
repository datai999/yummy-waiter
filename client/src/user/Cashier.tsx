import { Modal, Box, Typography, styled, Button, Stack, Badge } from "@mui/material";
import React, { useContext, useEffect, useRef, useState } from "react";
import { APP_CONTEXT } from "../App";
import { CategoryItem, LockedTable, Order, Receipt, Table } from "../my/my-class";
import { NumPad } from "../my/my-component";
import { SERVICE } from "../my/my-service";
import { MdOutlineCallMerge, MdOutlineCallSplit } from "react-icons/md";
import { TableStatus } from "../my/my-constants";
import { syncServer, SYNC_TYPE } from "../my/my-ws";
import { IoPrint } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { BsCashCoin } from "react-icons/bs";
import AddDiscount from "./AddDiscount";
import { FaGift } from "react-icons/fa";

export default function Cashier(props: {
    view: boolean,
    close: () => void,
    orders: Map<String, Table>,
    note: string,
    bags: Map<number, Map<string, CategoryItem>>
    receipt: Receipt
}) {
    const { auth, order, setOrder } = useContext(APP_CONTEXT);
    const [tendered, setTendered] = useState('');
    const [refresh, setRefresh] = useState(false);

    let receipt: Receipt = props.receipt;
    const numTendered = Number(tendered) / 100;
    const change = Math.ceil((numTendered - receipt.finalTotal) * 100) / 100;

    const customer = props.receipt.customer;
    const newPoint = Math.floor(props.receipt.finalTotal || 0);
    const nextPoint = (customer?.prePoint || 0) + newPoint;

    useEffect(() => {
        setTendered('');
    }, [props.view]);

    const onInput = (key: string) => {
        if (tendered.length > 4) return;
        setTendered(tendered + key);
    }

    const checkTendered = () => {
        if (numTendered < receipt.finalTotal) {
            alert('Amount not enough');
            return;
        }
        receipt.tendered = numTendered;
        receipt.change = change;
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
                        <AddDiscount view={props.view} receipt={receipt} addDiscount={() => setRefresh(!refresh)} />

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
                            {['100', '50', '40', '20', receipt.finalTotal.toFixed(2)].map((suggestTendered, index) =>
                                <Button
                                    key={suggestTendered}
                                    variant="outlined"
                                    color="primary"
                                    disabled={Number(suggestTendered) < receipt.finalTotal}
                                    onMouseDown={() => setTendered(index === 4 ? (Number(receipt.finalTotal) * 100 + '') : suggestTendered + '00')}
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
                        mt: 1,
                        justifyContent: "center",
                        alignItems: "stretch",
                    }}>
                        <Button variant="contained" color="primary" sx={{ minHeight: 50 }} onClick={props.close} >
                            Close
                            <IoMdClose style={iconStyle} />
                        </Button>
                        <Button variant="contained" color="primary" sx={{ minHeight: 50 }} onClick={() => alert('TODO')} >
                            Merge bill
                            <MdOutlineCallMerge style={iconStyle} />
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
                        {nextPoint < 100 || !customer || !customer.phone
                            ? (<Button variant="contained" color="primary" onClick={checkTendered} >
                                Cash
                                <BsCashCoin style={iconStyle} />
                            </Button>)
                            : (<Button variant="contained" color="primary" onClick={checkTendered} >
                                Cash
                                <BsCashCoin style={iconStyle} />
                                <Box sx={{ ml: 1, }}>
                                    +
                                </Box>
                                <Box sx={{ ml: 0.8, fontSize: 20 }}>
                                    {(nextPoint / 100).toFixed(0)}
                                </Box>
                                <FaGift style={{ fontSize: 25, marginLeft: 2, marginBottom: 8 }} />
                            </Button>)
                        }
                    </Stack>
                </Box >
            )
            }
        </ModalContent >
    </Modal >)
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