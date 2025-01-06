import React, {
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';

import _ from 'lodash';
import { FaChevronRight } from 'react-icons/fa';
import { GiPaperBagFolded } from 'react-icons/gi';
import { MdTableRestaurant } from "react-icons/md";

import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Grid2,
    Stack,
    Typography,
    useMediaQuery,
} from '@mui/material';

import {
    MENU,
    TableStatus,
} from '../my/my-constants';
import { StyledPaper } from '../my/my-styled';
import BagDnd from './BagDnd';
import { ChildWaiterProps } from './Waiter';
import { SYNC_TYPE, syncServer } from '../my/my-ws';
import { Pho, TrackedNonPho, TrackedPho } from '../my/my-class';
import TakePho from './TakePho';
import TakeNonPho from './TakeNonPho';
import { AuthContext, TableContext } from '../App';

const OrderTake = ({ props }: { props: ChildWaiterProps }) => {
    const { auth, logout } = useContext(AuthContext);
    const { table, orderTable } = useContext(TableContext);

    const [refresh, setRefresh] = useState(false)
    const [pho, setPho] = useState<Pho>(new Pho());
    const [itemRef, setItemRef] = useState({ bag: 0, trackedIndex: 0 });

    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

    const category = MENU[props.category as keyof typeof MENU];
    const bags = useRef(_.cloneDeep(table.bags)).current;

    useEffect(() => {
        bags.forEach(bag => bag.forEach(categoryItem => {
            categoryItem.pho.push(new TrackedPho(auth));
            categoryItem.nonPho.push(new TrackedNonPho(auth));
        }));
    }, [])

    const submitPho = (bag: number, newPho: Pho) => {
        if (bag > bags.size) bag = bags.size - 1;
        const isEdit = bag < 0;
        const targetBag = bags.get(isEdit ? itemRef.bag : bag)!;
        const categoryItems = targetBag.get(props.category)!;

        if (isEdit) {
            categoryItems.pho[itemRef.trackedIndex].items.set(newPho.id, newPho);
        } else {
            categoryItems.lastPhos().set(newPho.id, newPho);
        }
        categoryItems?.action.push(`${new Date().toISOString()}:${auth.name}:${isEdit ? 'Edit' : 'Add'} pho'`);

        setPho(new Pho());
    }

    const confirmOrder = () => {
        if (table.status === TableStatus.AVAILABLE) {
            table.status = TableStatus.ACTIVE;
            table.orderTime = new Date();
        }
        bags.forEach(bag => bag.forEach(categoryItem => {
            const lastPho = categoryItem.pho.pop()!;
            if (lastPho.items.size > 0) {
                lastPho.time = new Date();
                categoryItem.pho.push(lastPho);
            }
            const lastNonPho = categoryItem.nonPho.pop()!;
            if (lastNonPho.items.size > 0) {
                lastNonPho.time = new Date();
                categoryItem.nonPho.push(lastNonPho);
            }
        }));
        table.bags = bags;
        syncServer(SYNC_TYPE.TABLE, { [table.id]: table });
        setOpenConfirmDialog(false);
    };

    const showPho = (bag: number, category: string, trackIndex: number, selectedItemId: string) => {
        if (selectedItemId === null || selectedItemId.length === 0) {
            setPho(new Pho());
            return;
        }
        props.setCategory(category);
        setItemRef({ bag: bag, trackedIndex: trackIndex });
        setPho(bags.get(bag)!.get(props.category)!.pho[trackIndex].items.get(selectedItemId)!);
    }

    const addBag = () => {
        const newBag = table.newBag();
        newBag.forEach(categoryItem => {
            categoryItem.pho.push(new TrackedPho(auth));
            categoryItem.nonPho.push(new TrackedNonPho(auth));
        });
        bags.set(bags.size, newBag);
        setRefresh(!refresh);
    }

    if (useMediaQuery('(min-width:900px)')) return (
        <Grid2 container spacing={1} sx={{ display: { xs: 'none', sm: 'none', md: 'flex', lg: 'flex' }, mb: 1 }}>
            <Grid2 size={{ md: 9 }} >
                {category?.pho && (
                    <TakePho
                        category={props.category}
                        pho={pho}
                        submitPho={submitPho}
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
            </Grid2>
            <Grid2 size={{ md: 'grow' }}>
                <BagDnd bags={bags} phoId={pho.id} showPho={showPho} />
                <Stack direction="row" spacing={1} >
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={addBag}
                    >
                        Add bag
                        {/* <GiPaperBagFolded style={{ fontSize: 20, marginLeft: 8 }} /> */}
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            confirmOrder();
                            orderTable(null);
                        }}
                        disabled={false}
                    >
                        Next table
                        {/* <MdTableRestaurant style={{ marginLeft: 8 }} /> */}
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            confirmOrder();
                            logout();
                        }}
                        disabled={false}
                    >
                        Place Order
                        {/* <FaChevronRight style={{ marginLeft: 8 }} /> */}
                    </Button>
                </Stack>
            </Grid2>
        </Grid2 >
    );

    return (<>
        {category?.pho && (
            <TakePho
                category={props.category}
                pho={pho}
                submitPho={submitPho}
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
            <BagDnd bags={bags} phoId={pho?.id} showPho={showPho} />
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
                    Are you sure you want to place the order for Table {table.id}?
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