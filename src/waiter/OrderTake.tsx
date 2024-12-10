import React, {
  useEffect,
  useState,
} from 'react';

import {
  NonPho,
  Pho,
  SelectedItem,
} from 'myTypes';
import { FaChevronRight } from 'react-icons/fa';

import {
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
  BeefPreferences,
  BeefSideOrder,
  Categories,
  ChickenMeats,
  ChickenSideOrder,
  ChikenPreferences,
  DefaultPho,
  Dessert,
  Drinks,
  Noodles,
} from '../my/my-constants';
import { generateId } from '../my/my-service';
import { StyledPaper } from '../my/my-styled';
import OrderSummary from './OrderSummary';

const defaultSelectedItems: SelectedItem = {
    beef: new Map(),
    beefSide: new Map(),
    beefUpdated: [],

    chicken: new Map(),
    chickenSide: new Map(),
    chickenUpdated: [],

    drink: new Map(),
    dessert: new Map(),
};

const defaultNonPho: NonPho = {
    beefSide: [],
    beefMeatSide: [],
    chickenSide: [],
    dessert: [],
    drink: [],
}

type Props = {
    selectedTable: string,
    setSelectedTable(selectedTable: string): void,
    selectedCategory: Categories,
    setSelectedCategory: (selectedCategory: Categories) => void,
    refreshState: boolean
};

const OrderTake = ({ selectedTable, setSelectedTable, selectedCategory, setSelectedCategory, refreshState }: Props) => {
    const [pho, setPho] = useState<Pho>(DefaultPho);
    const [nonPho, setNonPho] = useState<NonPho>(defaultNonPho);
    const [selectedItems, setSelectedItems] = useState<SelectedItem>(defaultSelectedItems);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

    useEffect(() => {
        setPho(DefaultPho);
    }, [refreshState]);

    const handleAddItem = () => {
        const newItem = { ...selectedItems };
        const id = pho.id.length ? pho.id : generateId();
        const newPho = { ...pho, id: id };
        if (Categories.BEEF === selectedCategory) {
            if (newPho.meats.length === 0) newPho.meats = ["BPN"];
            else newPho.meats = newPho.meats.filter(meat => meat !== "BPN");
            newItem.beef.set(id, newPho);
            newItem.beefUpdated = [...newItem.beefUpdated, new Date().toISOString() + ':add beef'];
        } else if (Categories.CHICKEN === selectedCategory) {
            newItem.chicken.set(id, newPho);
            newItem.chickenUpdated = [...newItem.chickenUpdated, new Date().toISOString() + ':add chicken'];
        } else if (Categories.SIDE_ORDERS === selectedCategory) {
            const beefSide = [...nonPho.beefSide, ...nonPho.beefMeatSide];
            if (beefSide.length > 0) {
                beefSide.forEach((sideOrder, index) => {
                    newItem.beefSide.set(id + '_' + index, sideOrder);
                });
                newItem.beefUpdated = [...newItem.beefUpdated, new Date().toISOString() + ':add beef side'];
            }
            if (nonPho.chickenSide.length > 0) {
                nonPho.chickenSide.forEach((sideOrder, index) => {
                    newItem.chickenSide.set(id + '_' + index, sideOrder);
                });
                newItem.chickenUpdated = [...newItem.chickenUpdated, new Date().toISOString() + ':add chicken side'];
            }
            if (pho.note && pho.note.length > 0) {
                newItem.beefSide.set(id + '_note', pho.note);
                newItem.chickenSide.set(id + '_note', pho.note);
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
                const newSideItem = { id: id + "_note", name: pho.note, count: 1 };
                newItem.drink.set(newSideItem.id, newSideItem);
            }
        }
        console.log("newItem", newItem);
        setSelectedItems(newItem);
        setPho(DefaultPho);
        setNonPho(defaultNonPho);
    };

    const showPho = (category: Categories, selectedItemId: string) => {
        setSelectedCategory(category);
        if (Categories.BEEF === category)
            setPho({ ...selectedItems.beef.get(selectedItemId)! });
        else if (Categories.CHICKEN === category)
            setPho({ ...selectedItems.chicken.get(selectedItemId)! });
    }

    const confirmOrder = () => {
        console.log("Order placed:", { table: selectedTable, items: selectedItems });
        setOpenConfirmDialog(false);
        setSelectedItems(defaultSelectedItems);
        setSelectedTable("");
    };

    return (
        <>
            <StyledPaper sx={{ mb: 1, pb: 1 }}>

                {selectedCategory === Categories.BEEF && (
                    <CheckButton
                        multi={true}
                        allOptions={Object.keys(BeefMeats)}
                        options={pho.meats}
                        createLabel={(key) => BeefMeats[key as keyof typeof BeefMeats]}
                        callback={(meats) => setPho({ ...pho, meats })}
                    />
                )}

                {selectedCategory === Categories.CHICKEN && (
                    <CheckButton
                        multi={false}
                        allOptions={Object.keys(ChickenMeats)}
                        options={pho.meats}
                        createLabel={(key) => ChickenMeats[key as keyof typeof ChickenMeats]}
                        callback={(meats) => setPho({ ...pho, meats })}
                    />
                )}

                {[Categories.BEEF, Categories.CHICKEN].includes(selectedCategory) && (
                    <>
                        <Divider textAlign="left" sx={{ mb: 1 }}></Divider>
                        <CheckButton
                            multi={false}
                            allOptions={Object.keys(Noodles)
                                .filter(e => Categories.BEEF === selectedCategory
                                    ? ![Noodles.VERMICELL, Noodles.GLASS].includes(Noodles[e as keyof typeof Noodles])
                                    : e)}
                            options={[pho.noodle]}
                            createLabel={(key) => Noodles[key as keyof typeof Noodles]}
                            callback={(noodles) => setPho({ ...pho, noodle: noodles[0] })}
                        />
                        <Divider textAlign="left" sx={{ mb: 1 }}></Divider>
                    </>
                )}

                {selectedCategory === Categories.BEEF && (
                    <CheckButton
                        multi={true}
                        allOptions={Object.keys(BeefPreferences)}
                        options={pho.preferences}
                        createLabel={(key) => BeefPreferences[key as keyof typeof BeefPreferences]}
                        callback={(preferences) => setPho({ ...pho, preferences })}
                    />
                )}

                {selectedCategory === Categories.CHICKEN && (
                    <CheckButton
                        multi={true}
                        allOptions={Object.keys(ChikenPreferences)}
                        options={pho.preferences}
                        createLabel={(key) => ChikenPreferences[key as keyof typeof ChikenPreferences]}
                        callback={(preferences) => setPho({ ...pho, preferences })}
                    />
                )}

                {selectedCategory === Categories.SIDE_ORDERS && (
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

                {selectedCategory === Categories.DRINKS && (
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
                    <Grid2 size={{ xs: 7, sm: 6, md: 5 }}  >
                        <TextField
                            fullWidth
                            label="Special Notes"
                            size='small'
                            value={pho.note}
                            onChange={(e) => setPho({ ...pho, note: e.target.value })}
                        />
                    </Grid2>
                    <Grid2 size={{ xs: 5, sm: 3, md: 2 }}  >
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleAddItem}
                            fullWidth
                        >
                            {`${pho.id.length > 0 ? 'Edit item' : 'Add to Order'}`}
                        </Button>
                    </Grid2>
                </Grid2>

            </StyledPaper>

            <StyledPaper sx={{ mt: 0, pt: 0, mb: 1, pb: 1 }}>
                <OrderSummary
                    selectedItems={selectedItems} setSelectedItems={setSelectedItems}
                    phoId={pho.id} showPho={showPho}
                />
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => setOpenConfirmDialog(true)}
                    disabled={!selectedTable}
                    sx={{ mt: 1 }}
                >
                    Place Order <FaChevronRight style={{ marginLeft: 8 }} />
                </Button>
            </StyledPaper>

            <Dialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)}>
                <DialogTitle>Confirm Order</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to place the order for Table {selectedTable}?
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