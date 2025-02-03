import { Box, Button, Card, Grid2, Modal, Stack, styled, Typography } from '@mui/material';
import React, { useContext, useState } from 'react';
import { COMPONENT } from '../my/my-component';
import { AiOutlinePhone } from 'react-icons/ai';
import { APP_CONTEXT } from '../App';
import { TableStatus } from '../my/my-constants';
import { Order, Receipt } from '../my/my-class';
import { IoMdClose } from 'react-icons/io';
import ReceiptView from '../order/ReceiptView';

export default function CustomerView(props: { back: () => void }) {
    const { ORDERS } = useContext(APP_CONTEXT);
    const [receipt, setReceipt] = useState<null | Receipt>(null);

    return (<>
        <COMPONENT.Header back={props.back} actions={<Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <Box sx={{ ml: 5 }}>
                <COMPONENT.WrapCategoryButton props={{
                    selectedCategory: '(714) 884-4993', category: '(714) 884-4993', setCategory: () => { },
                    size: 'xlarge', icon: <AiOutlinePhone style={{ fontSize: 25, marginLeft: 2 }} />,
                }} />
            </Box>
        </Box>} />
        <Box sx={{ padding: "10px" }}>
            <Grid2 container spacing={2} columns={12}>
                {Array.from(ORDERS.values())
                    .filter(order => order.status === TableStatus.ACTIVE)
                    .map(order => (
                        <Grid2 key={order.id} size={{ xs: 6, sm: 4, md: 4, lg: 4 }}>
                            <CardOrder order={order} onClick={(order) => setReceipt(new Receipt('?', order, order.note).calculateTotal(order.bags))} />
                        </Grid2>
                    ))}
            </Grid2>
        </Box>
        <Modal
            open={Boolean(receipt)}
            onClose={() => setReceipt(null)}
        >
            <ModalContent>
                {receipt && (
                    <Box>
                        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                            <ReceiptView receipt={receipt} />

                            <Box sx={{ witdh: '300px', maxWidth: '300px' }}>
                                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', mb: 0 }}>
                                    {/* <Badge badgeContent={<Box sx={{ ml: 8, bgcolor: '#fff', fontSize: 14 }}>Tendered</Box>} anchorOrigin={{ vertical: 'top', horizontal: 'left', }} >
                                        <Typography variant="h4" sx={{ display: 'flex', flexDirection: 'row-reverse', mb: 2, p: 1, border: 'solid 1px', borderRadius: 2, minHeight: '45px', minWidth: '130px' }}>
                                            {(Number(tendered) / 100).toFixed(2)}
                                        </Typography>
                                    </Badge>
                                    <Badge badgeContent={<Box sx={{ ml: 8, bgcolor: '#fff', fontSize: 14 }}>Change</Box>} anchorOrigin={{ vertical: 'top', horizontal: 'left', }} >
                                        <Typography variant="h4" sx={{ display: 'flex', flexDirection: 'row-reverse', mb: 2, p: 1, border: 'solid 1px', borderRadius: 2, minHeight: '45px', minWidth: '130px' }}>
                                            {change.toFixed(2)}
                                        </Typography>
                                    </Badge> */}
                                </Box>
                                customer name/gender,age-range,phone/city
                            </Box>
                        </Box>

                        <Stack direction="row" spacing={4} sx={{
                            mt: 1,
                            justifyContent: "center",
                            alignItems: "stretch",
                        }}>
                            <Button variant="contained" color="primary" sx={{ minHeight: 50 }} onClick={() => setReceipt(null)} >
                                Close
                                <IoMdClose style={iconStyle} />
                            </Button>
                        </Stack>
                    </Box>
                )}
            </ModalContent>
        </Modal >
    </>);
}

const CardOrder = ({ order, ...props }: {
    order: Order,
    onClick: (order: Order) => void,
}) => {

    return (<StyledCard
        status={TableStatus.ACTIVE}
        onClick={() => props.onClick(order)}
    >
        <Box sx={{ p: 1, pb: 0, height: '150px', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ mb: 0, justifyContent: 'center' }}>
                <Typography variant="h4" sx={{ textAlign: 'center' }}>{order.getName()}</Typography>
                {order.note && <Typography variant="h6" sx={{ textAlign: 'center' }}>{` ${order.note}`}</Typography>}
            </Box>
            <Typography variant="h6" sx={{
                height: '100%', backgroundColor: 'white', m: 1, mt: order.note ? 0 : 1,
                border: 'solid 1px', borderRadius: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center'
            }}>View detail & Get reward</Typography>
        </Box>
    </StyledCard >)
}

const StyledCard = styled(Card)(({ status }: { status: TableStatus }) => ({
    minHeight: "95px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    borderRadius: 30,
    // background:
    //   status === "active"
    //     ? "#e8f5e9"
    //     : status === "attention"
    //       ? "#ffebee"
    //       : "#f5f5f5",
    background:
        status === TableStatus.ACTIVE
            ? "#ffebee"
            : status === TableStatus.AVAILABLE
                ? "#f5f5f5"
                : "#f5f5f5",
    "&:hover": {
        transform: "translateY(-5px)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
    }
}));

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