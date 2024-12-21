import React, {
    useEffect,
    useState,
} from 'react';

import _ from 'lodash';
import {
    NonPho,
    NonPhoCode,
    Pho,
    PhoCode,
    SelectedItem,
} from 'myTypes';
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
    BeefMeats,
    BeefMeatSideOrder,
    BeefMeatSideOrderCodes,
    BeefPreferences,
    BeefSideOrder,
    BeefSideOrderCodes,
    Categories,
    ChickenMeats,
    ChickenSideOrder,
    ChikenPreferences,
    DefaultPho,
    Dessert,
    Drinks,
    INIT_SELECTED_ITEM,
    Noodles,
    TableStatus,
} from '../my/my-constants';
import {
    generateId,
    toPhoCode,
} from '../my/my-service';
import { StyledPaper } from '../my/my-styled';
import BagDnd from './BagDnd';
import { Table } from 'myTable';
import { ChildWaiterProps } from './Waiter';
import { SYNC_TYPE, syncServer } from '../my/my-ws';

const defaultNonPho: NonPho = {
    beefSide: [],
    beefMeatSide: [],
    chickenSide: [],
    dessert: [],
    drink: [],
}

interface OrderTakeProps extends ChildWaiterProps {
    refreshState: boolean
}

const OrderTake = ({ props }: { props: OrderTakeProps }) => {
    const [pho, setPho] = useState<Pho>(DefaultPho);
    const [nonPho, setNonPho] = useState<NonPho>(defaultNonPho);

    const [bags, setBags] = useState<Map<number, SelectedItem>>(props.table.bags);

    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

    useEffect(() => {
        setPho(DefaultPho);
        setNonPho(defaultNonPho);
    }, [props.refreshState]);

    const handleItem = (newItem: SelectedItem) => {
        const id = pho.id.length ? pho.id : generateId();
        let newPho = { ...pho, id: id };
        if (Categories.BEEF === props.category) {
            newPho = toPhoCode(props.category, newPho);
            newItem.beef.set(id, newPho as PhoCode);
            newItem.beefUpdated = [...newItem.beefUpdated, new Date().toISOString() + ':add beef'];
        } else if (Categories.CHICKEN === props.category) {
            newPho = toPhoCode(props.category, newPho);
            newItem.chicken.set(id, newPho as PhoCode);
            newItem.chickenUpdated = [...newItem.chickenUpdated, new Date().toISOString() + ':add chicken'];
        } else if (Categories.SIDE_ORDERS === props.category) {
            if (nonPho.beefSide.length > 0) {
                nonPho.beefSide.forEach((item, index) => {
                    const newSideItem = { id: id + "_" + index, key: item, code: BeefSideOrderCodes[item as keyof typeof BeefSideOrderCodes], count: 1 } as NonPhoCode;
                    newItem.beefSide.set(newSideItem.id, newSideItem);
                });
                newItem.beefUpdated = [...newItem.beefUpdated, new Date().toISOString() + ':add beef side'];
            }
            if (nonPho.beefMeatSide.length > 0) {
                nonPho.beefMeatSide.forEach((item, index) => {
                    const newSideItem = { id: id + "_" + index, key: item, code: BeefMeatSideOrderCodes[item as keyof typeof BeefMeatSideOrderCodes], count: 1 } as NonPhoCode;
                    newItem.beefSide.set(newSideItem.id, newSideItem);
                });
                newItem.beefUpdated = [...newItem.beefUpdated, new Date().toISOString() + ':add beef meat side'];
            }
            if (nonPho.chickenSide.length > 0) {
                nonPho.chickenSide.forEach((item, index) => {
                    const newSideItem = { id: id + "_" + index, key: item, code: ChickenSideOrder[item as keyof typeof ChickenSideOrder], count: 1 } as NonPhoCode;
                    newItem.chickenSide.set(newSideItem.id, newSideItem);
                });
                newItem.chickenUpdated = [...newItem.chickenUpdated, new Date().toISOString() + ':add chicken side'];
            }
            if (pho.note && pho.note.length > 0) {
                const newSideItem = { id: id + "_note", code: pho.note, count: 1 } as NonPhoCode;
                newItem.beefSide.set(newSideItem.id, newSideItem);
                newItem.chickenSide.set(newSideItem.id, newSideItem);
                newItem.beefUpdated = [...newItem.beefUpdated, new Date().toISOString() + ':note'];
                newItem.chickenUpdated = [...newItem.chickenUpdated, new Date().toISOString() + ':note'];
            }
        } else {
            if (nonPho.drink.length > 0) {
                nonPho.drink.forEach((item, index) => {
                    const newSideItem = { id: id + "_" + index, code: item, name: Drinks[item as keyof typeof Drinks], count: 1 };
                    newItem.drink.set(newSideItem.id, newSideItem);
                });
            }
            if (nonPho.dessert.length > 0) {
                nonPho.dessert.forEach((item, index) => {
                    const newSideItem = { id: id + "_" + index, code: item, name: Dessert[item as keyof typeof Dessert], count: 1 };
                    newItem.dessert.set(newSideItem.id, newSideItem);
                });
            }
            if (pho.note) {
                const newSideItem = { id: id + "_note", code: pho.note, count: 1 } as NonPhoCode;;
                newItem.drink.set(newSideItem.id, newSideItem);
            }
        }
    };

    const addItem = (bag: number) => {
        const dineIn = new Map(bags);
        handleItem(dineIn.get(bag)!);
        setBags(dineIn);
        setPho(DefaultPho);
        setNonPho(defaultNonPho);
    }

    const confirmOrder = () => {
        if (props.table.status === TableStatus.AVAILABLE) {
            props.table.status = TableStatus.ACTIVE;
            props.table.orderTime = new Date();
        }
        syncServer(SYNC_TYPE.TABLE, props.table);
        setOpenConfirmDialog(false);
        props.orderTable(null);
        props.setIsWaiter(false);
    };

    const showPho = (bag: number, category: Categories, selectedItemId: string) => {
        props.setCategory(category);
        if (Categories.BEEF === category)
            setPho({ ...bags.get(bag)?.beef.get(selectedItemId)! });
        else if (Categories.CHICKEN === category)
            setPho({ ...bags.get(bag)?.chicken.get(selectedItemId)! });
    }

    const addBag = () => {
        const nextSelected = new Map(bags);
        nextSelected.set(bags.size, _.cloneDeep(INIT_SELECTED_ITEM));
        setBags(nextSelected);
    }

    return (
        <>
            <StyledPaper sx={{ mb: 1, pb: 1 }}>

                {props.category === Categories.BEEF && (
                    <CheckButton
                        multi={true}
                        allOptions={Object.keys(BeefMeats)}
                        options={pho.meats}
                        createLabel={(key) => BeefMeats[key as keyof typeof BeefMeats]}
                        callback={(meats) => setPho({ ...pho, meats })}
                    />
                )}

                {props.category === Categories.CHICKEN && (
                    <CheckButton
                        multi={false}
                        allOptions={Object.keys(ChickenMeats)}
                        options={pho.meats}
                        createLabel={(key) => ChickenMeats[key as keyof typeof ChickenMeats]}
                        callback={(meats) => setPho({ ...pho, meats })}
                    />
                )}

                {[Categories.BEEF, Categories.CHICKEN].includes(props.category) && (
                    <>
                        <Divider textAlign="left" sx={{ mb: 1 }}></Divider>
                        <CheckButton
                            multi={false}
                            allOptions={Object.keys(Noodles)
                                .filter(e => Categories.BEEF === props.category
                                    ? ![Noodles.VERMICELL, Noodles.GLASS, Noodles.EGG].includes(Noodles[e as keyof typeof Noodles])
                                    : e)}
                            options={[pho.noodle]}
                            createLabel={(key) => Noodles[key as keyof typeof Noodles]}
                            callback={(noodles) => setPho({ ...pho, noodle: noodles[0] })}
                        />
                        <Divider textAlign="left" sx={{ mb: 1 }}></Divider>
                    </>
                )}

                {props.category === Categories.BEEF && (
                    <CheckButton
                        multi={true}
                        allOptions={Object.keys(BeefPreferences)}
                        options={pho.preferences}
                        createLabel={(key) => BeefPreferences[key as keyof typeof BeefPreferences]}
                        callback={(preferences) => setPho({ ...pho, preferences })}
                    />
                )}

                {props.category === Categories.CHICKEN && (
                    <CheckButton
                        multi={true}
                        allOptions={Object.keys(ChikenPreferences)}
                        options={pho.preferences}
                        createLabel={(key) => ChikenPreferences[key as keyof typeof ChikenPreferences]}
                        callback={(preferences) => setPho({ ...pho, preferences })}
                    />
                )}

                {props.category === Categories.SIDE_ORDERS && (
                    <>
                        <CheckButton
                            multi={true}
                            allOptions={Object.keys(BeefSideOrder)}
                            options={nonPho.beefSide}
                            createLabel={(key) => BeefSideOrder[key as keyof typeof BeefSideOrder]}
                            callback={(newSideOrder) => setNonPho({ ...nonPho, beefSide: newSideOrder })}
                        />
                        <Divider textAlign="left" sx={{ mb: 1 }}></Divider>
                        <CheckButton
                            multi={true}
                            allOptions={Object.keys(BeefMeatSideOrder)}
                            options={nonPho.beefMeatSide}
                            createLabel={(key) => BeefMeatSideOrder[key as keyof typeof BeefMeatSideOrder]}
                            callback={(newSideOrder) => setNonPho({ ...nonPho, beefMeatSide: newSideOrder })}
                        />
                        <Divider textAlign="left" sx={{ mb: 1 }}></Divider>
                        <CheckButton
                            multi={true}
                            allOptions={Object.keys(ChickenSideOrder)}
                            options={nonPho.chickenSide}
                            createLabel={(key) => ChickenSideOrder[key as keyof typeof ChickenSideOrder]}
                            callback={(newSideOrder) => setNonPho({ ...nonPho, chickenSide: newSideOrder })}
                        />
                    </>

                )}

                {props.category === Categories.DRINKS && (
                    <>
                        <CheckButton
                            multi={true}
                            allOptions={Object.keys(Drinks)}
                            options={nonPho.drink}
                            createLabel={(key) => Drinks[key as keyof typeof Drinks]}
                            callback={(newSideOrder) => setNonPho({ ...nonPho, drink: newSideOrder })}
                        />
                        <Divider textAlign="left" sx={{ pb: 1.1, mb: 1, pt: 0 }}></Divider>
                        <CheckButton
                            multi={true}
                            allOptions={Object.keys(Dessert)}
                            options={nonPho.dessert}
                            createLabel={(key) => Dessert[key as keyof typeof Dessert]}
                            callback={(newSideOrder) => setNonPho({ ...nonPho, dessert: newSideOrder })}
                        />
                    </>
                )}

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