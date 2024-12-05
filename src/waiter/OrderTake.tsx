import React, { useState } from 'react';

import {
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

import { CheckButton } from '../my-component';
import {
  BeefMeats,
  BeefPreferences,
  Categories,
  ChickenMeats,
  ChikenPreferences,
  DefaultPho,
  Noodles,
} from '../my-constants';
import { StyledPaper } from '../my-styled';
import OrderSummary from './OrderSummary';

type Props = {
    selectedTable: string,
    setSelectedTable(selectedTable: string): void,
    selectedCategory: Categories
};

const OrderTake = ({ selectedTable, setSelectedTable, selectedCategory }: Props) => {
    const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
    const [pho, setPho] = useState<Pho>(DefaultPho);
    const [notes, setNotes] = useState("");
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

    const handleAddItem = () => {
        const newItem = {
            id: Date.now(),
            category: selectedCategory,
            pho: pho,
            notes: notes,
        };
        setSelectedItems([...selectedItems, newItem]);
        setPho(DefaultPho);
        setNotes("");
    };

    const handlePlaceOrder = () => {
        setOpenConfirmDialog(true);
    };

    const confirmOrder = () => {
        console.log("Order placed:", { table: selectedTable, items: selectedItems });
        setOpenConfirmDialog(false);
        setSelectedItems([]);
        setSelectedTable("");
    };

    return (
        <>
            <StyledPaper>

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

                <Grid2 container spacing={2} alignItems="center">
                    <Grid2 size={{ xs: 7, sm: 6, md: 3 }}  >
                        <TextField
                            fullWidth
                            label="Special Notes"
                            size='small'
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </Grid2>
                    <Grid2 size={{ xs: 5, sm: 3, md: 2 }}  >
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleAddItem}
                            fullWidth
                        >
                            Add to Order
                        </Button>
                    </Grid2>
                </Grid2>

            </StyledPaper>

            <StyledPaper>

                <OrderSummary selectedItems={selectedItems} setSelectedItems={setSelectedItems} />

                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handlePlaceOrder}
                    disabled={!selectedTable || selectedItems.length === 0}
                    sx={{ mt: 2 }}
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