import { Box, Card, Divider, Grid2, Modal, styled, Typography, useTheme } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { COMPONENT } from '../my/my-component';
import { AiOutlinePhone } from 'react-icons/ai';
import { APP_CONTEXT } from '../App';
import { TableStatus } from '../my/my-constants';
import { Order, Receipt } from '../my/my-class';
import { IoMdClose } from 'react-icons/io';
import ReceiptView from '../order/ReceiptView';
import ScanYelp from '../assets/scan_free_tofu.png';
import YummyLogo from '../assets/yummy.png';
import { StyledPaper } from '../my/my-styled';
import EarnPoint from './EarnPoint';
import { SYNC_TYPE, syncServer } from '../my/my-ws';

export default function CustomerView(props: { back: () => void }) {
    const theme = useTheme();

    const { ORDERS } = useContext(APP_CONTEXT);
    const [receipt, setReceipt] = useState<null | Receipt>(null);

    const viewOrder = (order: Order) => {
        syncServer(SYNC_TYPE.CUSTOMER_VIEW_ORDER, { orderId: order.id, view: true });
        setReceipt(new Receipt('?', order, order.note).calculateTotal(order.bags));
    }

    const closeOrder = (order: Order) => {
        syncServer(SYNC_TYPE.CUSTOMER_VIEW_ORDER, { orderId: order.id, view: false });
        setReceipt(null);
    }

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
                            <CardOrder order={order} onClick={viewOrder} />
                        </Grid2>
                    ))}
            </Grid2>
        </Box>
        <Modal
            open={Boolean(receipt)}
            onClose={() => closeOrder(receipt!)}
        >
            <ModalContent>
                {receipt && (
                    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                        {/* <StyledPaper sx={{ m: 0, p: 0, mr: 5 }}>
                            <ScanImage src={ScanYelp} alt="Yummy Logo" sx={{ display: { xs: 'none', sm: 'block' } }} onClick={() => props.back()} />
                        </StyledPaper> */}

                        <Box sx={{ mt: '20px' }}>
                            <ReceiptView receipt={receipt} close={() => closeOrder(receipt)} />
                            {/* <Stack direction="row" spacing={4} sx={{
                                m: 1,
                                justifyContent: "left",
                                alignItems: "stretch",
                            }}>
                                <Button variant="contained" color="primary" sx={{ minHeight: 50 }} onClick={() => setReceipt(null)} >
                                    Close
                                    <IoMdClose style={iconStyle} />
                                </Button>
                            </Stack> */}
                        </Box>

                        <Box sx={{ ml: '10px', mt: '15px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                                <LogoImage src={YummyLogo} alt="Yummy Logo" sx={{ display: { xs: 'none', sm: 'block' } }} onClick={() => props.back()} />
                                <Box sx={{ display: 'flex', flexDirection: 'column-reverse', mb: '5px' }}>
                                    <Typography variant='h5' color="white" align="center" sx={{ p: '7px', m: '15px', mt: 0 }} letterSpacing={3}
                                        style={{ fontSize: '16px', backgroundColor: theme.palette.primary.main, borderRadius: 50 }} >
                                        VIETNAMESE NOODLE SOUP
                                    </Typography>
                                    <Typography style={{ fontWeight: 'bold', fontSize: '50px' }}>
                                        YUMMY PHỞ 2
                                    </Typography>
                                </Box>
                            </Box>
                            <EarnPoint receipt={receipt} />
                        </Box>
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
    width: "1020px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    padding: "20px",
    paddingRight: "5px",
    paddingTop: 0,
    overflowY: "auto"
});

const iconStyle = {
    fontSize: 30, marginLeft: 8
}

const ScanImage = styled("img")({
    width: "435px",
    height: "630px",
    objectFit: "contain"
});

const LogoImage = styled("img")({
    width: "150px",
    height: "150px",
    objectFit: "contain"
});