import React, {
    useEffect,
    useState,
} from 'react';

import _ from 'lodash';
import { FaChevronRight } from 'react-icons/fa';
import { GiPaperBagFolded } from 'react-icons/gi';

import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Typography,
} from '@mui/material';

import {
    Categories,
    CATEGORY,
    TableStatus,
} from '../my/my-constants';
import { StyledPaper } from '../my/my-styled';
import BagDnd from './BagDnd';
import { ChildWaiterProps } from './Waiter';
import { SYNC_TYPE, syncServer } from '../my/my-ws';
import { Pho } from '../my/my-class';
import TakePho from './TakePho';
import TakeNonPho from './TakeNonPho';

interface OrderTakeProps extends ChildWaiterProps {
    refreshState: boolean
}

const OrderTake = ({ props }: { props: OrderTakeProps }) => {
    const [refresh, setRefresh] = useState(false)
    const [pho, setPho] = useState<Pho>(new Pho());

    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

    const bags = props.table.bags;
    const category = CATEGORY[props.category as keyof typeof CATEGORY];

    useEffect(() => {
        setPho(new Pho());
    }, [props.refreshState]);

    const confirmOrder = () => {
        if (props.table.status === TableStatus.AVAILABLE) {
            props.table.status = TableStatus.ACTIVE;
            props.table.orderTime = new Date();
        }
        syncServer(SYNC_TYPE.TABLE, { [props.table.id]: props.table });
        setOpenConfirmDialog(false);
        props.orderTable(null);
        props.setIsWaiter(false);
    };

    const showPho = (bag: number, category: Categories, selectedItemId: string) => {
        if (selectedItemId === null || selectedItemId.length === 0) {
            setPho(new Pho());
            return;
        }
        props.setCategory(category);
        setPho(bags.get(bag)?.get(props.category)?.pho.get(selectedItemId)!);
    }

    const addBag = () => {
        props.table.func.newBag();
        setRefresh(!refresh);
    }

    return (<>
        {category?.pho && (
            <TakePho
                category={props.category}
                bags={bags}
                pho={pho}
                onSubmit={() => {
                    setPho(new Pho());
                    setRefresh(!refresh);
                }}
            />
        )}

        {category?.nonPho && (
            <TakeNonPho
                category={props.category}
                bags={bags}
                onSubmit={() => {
                    setRefresh(!refresh);
                }}
            />
        )}

        <StyledPaper sx={{ mt: 0, p: 0 }}>
            <BagDnd bags={bags} phoId={pho.id} showPho={showPho} />
            <Box display="flex"
                justifyContent="center"
                alignItems="center">
                <Button
                    variant="contained"
                    color="primary"
                    onClick={addBag}
                    sx={{ mr: '10%' }}
                >
                    Add bag <GiPaperBagFolded style={{ fontSize: 20, marginLeft: 8 }} />
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => confirmOrder()}
                    disabled={false}
                    sx={{ mr: '20%' }}
                >
                    Place Order <FaChevronRight style={{ marginLeft: 8 }} />
                </Button>
            </Box>
        </StyledPaper>

        <Dialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)}>
            <DialogTitle>Confirm Order</DialogTitle>
            <DialogContent>
                <Typography>
                    Are you sure you want to place the order for Table {props.table.id}?
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpenConfirmDialog(false)}>Cancel</Button>
                <Button onClick={confirmOrder} variant="contained" color="primary">
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    </>
    );
};

export default OrderTake;