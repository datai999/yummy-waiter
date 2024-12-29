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

import { CheckButton } from '../my/my-component';
import {
    BEEF_MEAT_SIDE,
    BEEF_SIDE,
    Categories,
    CATEGORY,
    CHICKEN_SIDE,
    DESSERT,
    DRINK,
    TableStatus,
} from '../my/my-constants';
import { StyledPaper } from '../my/my-styled';
import BagDnd from './BagDnd';
import { ChildWaiterProps } from './Waiter';
import { SYNC_TYPE, syncServer } from '../my/my-ws';
import { CategoryItem, NonPho, Pho } from '../my/my-class';
import TakePho from './TakePho';

const defaultNonPho = {
    beefSides: new Map<string, NonPho>(),
    chickenSides: new Map<string, NonPho>(),
    drink: new Map<string, NonPho>(),
    dessert: new Map<string, NonPho>(),
}

interface OrderTakeProps extends ChildWaiterProps {
    refreshState: boolean
}

const OrderTake = ({ props }: { props: OrderTakeProps }) => {
    const [refresh, setRefresh] = useState(false)
    const [pho, setPho] = useState<Pho>(new Pho());
    const [nonPho, setNonPho] = useState(defaultNonPho);

    const [bags, setBags] = useState<Map<number, Map<string, CategoryItem>>>(props.table.bags);

    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

    useEffect(() => {
        setPho(new Pho());
        setNonPho(defaultNonPho);
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
            setNonPho(defaultNonPho);
            return;
        }
        props.setCategory(category);
        setPho(bags.get(bag)?.get(props.category)?.pho.get(selectedItemId)!);
    }

    const addBag = () => {
        props.table.func.newBag();
    }

    const updateNonPho = (propertyKey: string, nonPhoCode: string) => {
        const nextNonPho = { ...nonPho };
        const property = nextNonPho[propertyKey as keyof typeof nextNonPho] as Map<string, NonPho>;
        if (property.has(nonPhoCode)) {
            property.get(nonPhoCode)!.count++;
        } else {
            property.set(nonPhoCode, new NonPho(nonPhoCode));
        }
        setNonPho(nextNonPho);

        const cloneBags = new Map(bags);
        const dineIn = cloneBags.get(0)!;
        const categoryItems = dineIn.get(props.category)!;

        if (nextNonPho.beefSides.size > 0) {
            categoryItems.nonPho = nextNonPho.beefSides;

        }
        if (nextNonPho.chickenSides.size > 0) {
            categoryItems.nonPho = nextNonPho.chickenSides;
        }
        categoryItems.action.push(new Date().toISOString() + ':add nonPho');
        setBags(cloneBags);
    }

    return (<>
        {Object.keys(CATEGORY).filter(category => props.category === category)
            .map(category => (
                <TakePho
                    key={category}
                    category={category}
                    bags={bags}
                    pho={pho}
                    onSubmit={() => {
                        setPho(new Pho());
                        setRefresh(!refresh);
                    }}
                />))}

        <StyledPaper>
            {props.category === Categories.BEEF && (
                <>
                    <CheckButton
                        multi={true}
                        allOptions={Object.keys(BEEF_SIDE)}
                        options={[]}
                        createLabel={(key) => key}
                        callback={(newSideOrder) => updateNonPho('beefSides', newSideOrder[0])}
                    />
                    <Divider textAlign="left" sx={{ mb: 1 }}></Divider>
                    <CheckButton
                        multi={true}
                        allOptions={Object.keys(BEEF_MEAT_SIDE)}
                        options={[]}
                        createLabel={(key) => key}
                        callback={(newSideOrder) => updateNonPho('beefSides', newSideOrder[0])}
                    />
                </>
            )}
            {props.category === Categories.CHICKEN && (
                <CheckButton
                    multi={true}
                    allOptions={Object.keys(CHICKEN_SIDE)}
                    options={[]}
                    createLabel={(key) => key}
                    callback={(newSideOrder) => updateNonPho('chickenSides', newSideOrder[0])}
                />
            )}
            {props.category === Categories.DRINKS && (
                <>
                    <CheckButton
                        multi={true}
                        allOptions={Object.keys(DRINK)}
                        options={[]}
                        createLabel={(key) => key}
                        callback={(newSideOrder) => updateNonPho('drink', newSideOrder[0])}
                    />
                    <Divider textAlign="left" sx={{ mb: 1 }}></Divider>
                    <CheckButton
                        multi={true}
                        allOptions={Object.keys(DESSERT)}
                        options={[]}
                        createLabel={(key) => key}
                        callback={(newSideOrder) => updateNonPho('dessert', newSideOrder[0])}
                    />
                </>
            )}
        </StyledPaper>

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