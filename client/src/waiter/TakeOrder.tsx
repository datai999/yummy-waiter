import React, {
    useEffect,
    useState,
} from 'react';

import _ from 'lodash';
import {
    NonPho,
    NonPhoCode,
    Pho,
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
    BEEF_COMBO,
    BEEF_MEAT,
    BEEF_NOODLE,
    BEEF_REFERENCES,
    BeefMeatSideOrder,
    BeefMeatSideOrderCodes,
    BeefSideOrder,
    BeefSideOrderCodes,
    Categories,
    CHICKEN_COMBO,
    CHICKEN_NOODLE,
    CHICKEN_REFERENCES,
    ChickenSideOrder,
    DefaultPho,
    Dessert,
    Drinks,
    INIT_SELECTED_ITEM,
    TableStatus,
} from '../my/my-constants';
import {
    generateId,
    sortBeefMeat,
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

    useEffect(() => {
        const meatCodes = pho.meats.sort(sortBeefMeat).join(',');
        const combo = Object.entries(props.category === Categories.BEEF ? BEEF_COMBO : CHICKEN_COMBO)
            .find(([key, value]) => {
                if (value.length !== pho.meats.length) return false;
                return value.sort(sortBeefMeat).join(',') === meatCodes;
            });
        setPho({ ...pho, combo: combo ? combo[0] : '' });
    }, [pho.meats]);

    const handleItem = (newItem: SelectedItem) => {
        const id = pho.id.length ? pho.id : generateId();
        let newPho = { ...pho, id: id };
        if (Categories.BEEF === props.category) {
            newPho = toPhoCode(props.category, newPho);
            newItem.beef.set(id, newPho as Pho);
            newItem.beefUpdated = [...newItem.beefUpdated, new Date().toISOString() + ':add beef'];
        } else if (Categories.CHICKEN === props.category) {
            newPho = toPhoCode(props.category, newPho);
            newItem.chicken.set(id, newPho as Pho);
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
        syncServer(SYNC_TYPE.TABLE, { [props.table.id]: props.table });
        setOpenConfirmDialog(false);
        props.orderTable(null);
        props.setIsWaiter(false);
    };

    const showPho = (bag: number, category: Categories, selectedItemId: string) => {
        if (selectedItemId === null || selectedItemId.length === 0) {
            setPho(DefaultPho);
            setNonPho(defaultNonPho);
            return;
        }
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

    console.log(pho);

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
                            createLabel={(key) => BEEF_MEAT[key as keyof typeof BEEF_MEAT].label}
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
                                        options={pho.preferences}
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