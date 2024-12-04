import React, { useState } from "react";
import {
    Box,
    Container,
    Typography,
    Grid,
    Button,
    TextField,
    Chip,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";
import { styled } from "@mui/system";
import { FaChevronRight } from "react-icons/fa";
import OrderSummary from "./OrderSummary";
import { Categories } from ".././constants";
import { CategoryButton } from "../Common";

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    backgroundColor: "#fff",
    borderRadius: theme.shape.borderRadius,
}));

type Pho = {
    meat: string,
    noodle: string,
    preferences?: string[],
    notes?: string,
}

type SelectedItem = {
    id: number,
    category: string,
    pho: Pho
};

type Props = {
    selectedCategory: Categories,
    setSelectedCategory(selectedItems: Categories): void;
};

const OrderTake = ({ selectedCategory, setSelectedCategory }: Props) => {
    const [selectedTable, setSelectedTable] = useState("");
    const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
    const [customizations, setCustomizations] = useState<Pho>({} as Pho);
    const [notes, setNotes] = useState("");
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

    const meatOptions = {
        BEEF: ["DB", "Tái", "Chín", "Gầu", "Gân", "Sách", "Bò viên", "XiQ"],
        CHICKEN: ["Ức", "Đùi", "Cánh"],
    };
    const noodleTypes = ["BC", "BT", "BS", "BTS", "Bún", "Miến"];
    const preferences = ["Togo", "Hành lá", "Hành tây", "Ngò", "Nước trong", "Ít bánh", "HD", "HT", "Thêm béo", "Khô", "Măng"];
    ;

    const handleAddItem = () => {
        const newItem = {
            id: Date.now(),
            category: selectedCategory,
            pho: customizations,
            notes: notes,
        };
        setSelectedItems([...selectedItems, newItem]);
        setCustomizations({} as Pho);
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
            <Box sx={{ display: { sm: 'block', md: 'none' }, flexWrap: "wrap" }}>
                {Object.values(Categories).map((category) => (
                    <CategoryButton
                        key={category}
                        selected={selectedCategory === Categories[category as keyof typeof Categories]}
                        onClick={() => setSelectedCategory(Categories[category as keyof typeof Categories])}
                        variant="contained"
                        size="small"
                    >
                        {category}
                    </CategoryButton>
                ))}
            </Box>

            <StyledPaper>
                {(selectedCategory === Categories.BEEF || selectedCategory === Categories.CHICKEN) && (
                    <>
                        <Grid container spacing={1} sx={{ mb: 2 }}>
                            {meatOptions[selectedCategory].map((option) => (
                                <Grid item key={option}>
                                    <Chip
                                        label={option}
                                        onClick={() =>
                                            setCustomizations({
                                                ...customizations,
                                                meat: option,
                                            })
                                        }
                                        color={customizations.meat === option ? "primary" : "default"}
                                    />
                                </Grid>
                            ))}
                        </Grid>

                        <Grid container spacing={1} sx={{ mb: 2 }}>
                            {noodleTypes.map((type) => (
                                <Grid item key={type}>
                                    <Chip
                                        label={type}
                                        onClick={() =>
                                            setCustomizations({
                                                ...customizations,
                                                noodle: type,
                                            })
                                        }
                                        color={
                                            customizations.noodle === type ? "primary" : "default"
                                        }
                                    />
                                </Grid>
                            ))}
                        </Grid>

                        <Grid container spacing={1} sx={{ mb: 2 }}>
                            {preferences.map((pref) => (
                                <Grid item key={pref}>
                                    <Chip
                                        label={pref}
                                        onClick={() => {
                                            const currentPrefs = customizations.preferences || [];
                                            const newPrefs = currentPrefs.includes(pref)
                                                ? currentPrefs.filter((p) => p !== pref)
                                                : [...currentPrefs, pref];
                                            setCustomizations({
                                                ...customizations,
                                                preferences: newPrefs,
                                            });
                                        }}
                                        color={
                                            customizations.preferences?.includes(pref)
                                                ? "primary"
                                                : "default"
                                        }
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </>
                )}

                <TextField
                    fullWidth
                    multiline
                    rows={1}
                    label="Special Notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    sx={{ mb: 2 }}
                />

                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddItem}
                    fullWidth
                >
                    Add to Order
                </Button>
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