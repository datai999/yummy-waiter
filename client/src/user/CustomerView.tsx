import { Box, Button, Card, Grid2, Stack, styled, Typography } from '@mui/material';
import React, { useContext } from 'react';
import { COMPONENT } from '../my/my-component';
import { AiOutlinePhone } from 'react-icons/ai';
import { APP_CONTEXT, CONTEXT } from '../App';
import { TableStatus } from '../my/my-constants';
import { Order } from '../my/my-class';
import BagDnd from '../order/BagDnd';
import { ORDER_CONTEXT } from '../order/OrderView';

export default function CustomerView(props: { back: () => void }) {
    const { ORDERS } = useContext(APP_CONTEXT);

    const onClickOrder = () => {

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
                            <CardOrder order={order} onClick={onClickOrder} />
                        </Grid2>
                    ))}
            </Grid2>
        </Box>
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
        <Grid2 container sx={{ p: 1, pb: 0 }}>
            <Grid2 size='grow' >
                <Button variant='outlined' sx={{ float: 'right' }}>
                    View detail
                </Button>
                <Box sx={{ mb: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Typography variant="h4" sx={{ textAlign: 'center' }}>{order.getName()}</Typography>
                    {order.note && <Typography variant="h6" sx={{ textAlign: 'center' }}>{` ${order.note}`}</Typography>}
                </Box>
                <Box sx={{
                    display: "flex",
                    flexDirection: "column",
                    overflowY: "scroll",
                    maxHeight: 250,
                }}>
                    <CONTEXT.Table.Provider value={{ table: order, order: order, orderTable: () => { }, setOrder: () => { }, prepareChangeTable: () => { } }}>
                        <ORDER_CONTEXT.Provider value={{ refreshOrderView: () => { }, expand: false, discount: true, viewOnly: true }}>
                            <BagDnd bags={order.bags} phoId={''} />
                        </ORDER_CONTEXT.Provider>
                    </CONTEXT.Table.Provider>
                </Box>
            </Grid2>
            <Grid2>
                <Typography>

                </Typography>
                {/* <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {lockedServer && !tableServers.includes(lockedServer || '') &&
                            <Box sx={{ fontSize: 12 }}>
                                {`${lockedServer} `}
                                <FaPen />
                            </Box>}
                        {tableServers.map(server =>
                            <Box key={server} sx={{ fontSize: 12 }}>
                                {`${server} `}
                                {lockedServer === server && <FaPen />}
                            </Box>)}
                    </Box> */}
            </Grid2>
        </Grid2>
    </StyledCard>)
}

const StyledCard = styled(Card)(({ status }: { status: TableStatus }) => ({
    minHeight: "95px",
    cursor: "pointer",
    transition: "all 0.3s ease",
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