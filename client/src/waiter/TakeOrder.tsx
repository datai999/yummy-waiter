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
    Grid2,
    TextField,
    Typography,
} from '@mui/material';

import { CheckButton } from '../my/my-component';
import {
    BEEF_COMBO,
    BEEF_MEAT,
    BEEF_MEAT_SIDE,
    BEEF_NOODLE,
    BEEF_REFERENCES,
    BEEF_SIDE,
    Categories,
    CHICKEN_COMBO,
    CHICKEN_NOODLE,
    CHICKEN_REFERENCES,
    CHICKEN_SIDE,
    DESSERT,
    DRINK,
    INIT_SELECTED_ITEM,
    TableStatus,
} from '../my/my-constants';
import * as SERVICE from '../my/my-service';
import { StyledPaper } from '../my/my-styled';
import BagDnd from './BagDnd';
import { ChildWaiterProps } from './Waiter';
import { SYNC_TYPE, syncServer } from '../my/my-ws';
import { CategoryItem, NonPho, Pho } from '../my/my-class';

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
    const [pho, setPho] = useState<Pho>(new Pho());
    const [nonPho, setNonPho] = useState(defaultNonPho);

    const [bags, setBags] = useState<Map<number, Map<string, CategoryItem>>>(props.table.bags);

    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

    useEffect(() => {
        setPho(new Pho());
        setNonPho(defaultNonPho);
    }, [props.refreshState]);

    useEffect(() => {
        pho.meats.sort(SERVICE.sortBeefMeat);
        const meatCodes = pho.meats.join(',');
        const combo = Object.entries(props.category === Categories.BEEF ? BEEF_COMBO : CHICKEN_COMBO)
            .find(([key, value]) => {
                if (value.length !== pho.meats.length) return false;
                return value.sort(SERVICE.sortBeefMeat).join(',') === meatCodes;
            });
        if (combo && combo[0] !== pho.combo) {
            setPho({ ...pho, combo: combo[0] });
        }
    }, [pho.meats]);

    const addItem = (bag: number) => {
        const cloneBags = new Map(bags);
        const dineIn = cloneBags.get(bag)!;

        const categoryItems = dineIn.get(props.category);
        pho.func.complete();
        categoryItems?.pho.set(pho.id, pho);
        categoryItems?.action.push(new Date().toISOString() + ':add pho');

        setBags(cloneBags);
        setPho(new Pho());
        setNonPho(defaultNonPho);
    }

    console.log(pho);

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

    return (
        <>
            <StyledPaper sx={{ mb: 1, pb: 1 }}>

                {props.category === Categories.BEEF && (
                    <>
                        <CheckButton
                            multi={false}
                            allOptions={Object.keys(BEEF_COMBO)}
                            options={[pho.combo as string]}
                            createLabel={(key) => key}
                            callback={(combo) => setPho({
                                ...pho,
                                combo: combo.length === 0 ? '' : combo[0],
                                meats: combo.length === 0 ? [] : BEEF_COMBO[combo[0] as keyof typeof BEEF_COMBO]
                            })}
                        />
                        <Divider textAlign="left" sx={{ mb: 1 }}></Divider>
                        <CheckButton
                            multi={true}
                            allOptions={Object.keys(BEEF_MEAT)}
                            options={pho.meats}
                            createLabel={(key) => key}
                            callback={(meats) => setPho({ ...pho, meats })}
                        />
                    </>
                )}

                {props.category === Categories.CHICKEN && (
                    <CheckButton
                        multi={false}
                        allOptions={Object.keys(CHICKEN_COMBO)}
                        options={[pho.combo as string]}
                        createLabel={(key) => key}
                        callback={(combo) => setPho({
                            ...pho,
                            combo: combo.length === 0 ? '' : combo[0],
                            meats: combo.length === 0 ? [] : CHICKEN_COMBO[combo[0] as keyof typeof CHICKEN_COMBO]
                        })}
                    />
                )}

                {[Categories.BEEF, Categories.CHICKEN].includes(props.category) && (
                    <>
                        <Divider textAlign="left" sx={{ mb: 1 }}></Divider>
                        <CheckButton
                            multi={false}
                            allOptions={Categories.BEEF === props.category ? BEEF_NOODLE : CHICKEN_NOODLE}
                            options={[pho.noodle]}
                            createLabel={(key) => key}
                            callback={(noodles) => setPho({ ...pho, noodle: noodles[0] })}
                        />
                        <Divider textAlign="left" sx={{ mb: 1 }}></Divider>
                        {[Categories.BEEF, Categories.CHICKEN].filter(category => props.category === category)
                            .map(category => {
                                const references = Categories.BEEF === category ? BEEF_REFERENCES : CHICKEN_REFERENCES;
                                return (
                                    <CheckButton
                                        key={category}
                                        multi={true}
                                        allOptions={Object.keys(references)}
                                        options={pho.preferences || []}
                                        createLabel={(key) => key}
                                        callback={(preferences) => setPho({
                                            ...pho, preferences
                                        })}
                                    />
                                )
                            })
                        }
                    </>
                )}

                {[Categories.BEEF, Categories.CHICKEN].includes(props.category) && (
                    <Grid2 container spacing={2} alignItems="center">
                        <Grid2 size={{ xs: 5, sm: 6, md: 5 }}  >
                            <TextField
                                fullWidth
                                label="Special Notes"
                                size='small'
                                value={pho.note}
                                onChange={(e) => setPho({ ...pho, note: e.target.value })}
                            />
                        </Grid2>
                        <Grid2 size={{ xs: 'auto', sm: 2, md: 2 }}  >
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => addItem(0)}
                                fullWidth
                            >
                                {`${pho.id.length > 0 ? 'Edit item' : 'Dine-in'}`}
                            </Button>
                        </Grid2>
                        <Grid2 size={{ xs: 'auto', sm: 2, md: 2 }}  >
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => addItem(1)}
                                fullWidth
                            >
                                {`Togo`}
                            </Button>
                        </Grid2>
                    </Grid2>
                )}
            </StyledPaper>

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