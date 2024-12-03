import React, { useState } from "react";
import {
    Box,
    BoxProps,
    Container,
    Typography,
    Select,
    MenuItem,
    Grid,
    Button,
    ButtonProps,
    TextField,
    Chip,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
} from "@mui/material";
import { styled } from "@mui/system";
import { FaUtensils, FaChevronRight, FaTrash } from "react-icons/fa";

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    backgroundColor: "#fff",
    borderRadius: theme.shape.borderRadius,
}));

interface StyledButtonProps extends ButtonProps {
    selected?: boolean;
}

interface StyledBoxProps extends BoxProps {
    selected?: boolean;
}

const CategoryButton = styled(Button, {
    shouldForwardProp: (prop) => prop !== 'selected',
})<StyledButtonProps>(({ theme, selected }) => ({
    margin: theme.spacing(1),
    backgroundColor: selected ? theme.palette.primary.main : "#fff",
    color: selected ? "#fff" : theme.palette.text.primary,
    "&:hover": {
        backgroundColor: selected ? theme.palette.primary.dark : "#f5f5f5",
    },
}));

const OrderItem = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'selected',
})<StyledBoxProps>(({ theme, selected }) => ({
    padding: theme.spacing(2),
    marginBottom: theme.spacing(1),
    backgroundColor: selected ? "#f5f5f5" : "#fff",
    borderRadius: theme.shape.borderRadius,
    cursor: "pointer",
    transition: "all 0.3s ease",
    border: `1px solid ${selected ? theme.palette.primary.main : "#ddd"}`,
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

const WaiterInterface = () => {
    const [selectedTable, setSelectedTable] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Beef");
    const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
    const [selectedOrderItem, setSelectedOrderItem] = useState<SelectedItem>({} as SelectedItem);
    const [customizations, setCustomizations] = useState<Pho>({} as Pho);
    const [notes, setNotes] = useState("");
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

    const categories = ["Beef", "Chicken", "Drinks", "Side Orders", "Dessert"];
    const meatOptions = {
        Beef: ["Rare Beef", "Well Done Beef", "Beef Balls", "Tendon", "Tripe"],
        Chicken: ["Grilled Chicken", "Steamed Chicken", "Chicken Breast", "Dark Meat"],
    };
    const noodleTypes = ["Thin rice noodles", "Thick rice noodles"];
    const preferences = [
        "Less noodles",
        "No onions",
        "Extra broth",
        "Spicy",
        "No cilantro",
    ];

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

    const handleRemoveItem = (itemId: number) => {
        setSelectedItems(selectedItems.filter((item) => item.id !== itemId));
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
        <Container maxWidth="lg">
            <Box sx={{ py: 3 }}>
                <StyledPaper>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={6}>
                            <Typography variant="h5" gutterBottom>
                                <FaUtensils style={{ marginRight: 8 }} /> Pho Restaurant Orders
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Select
                                fullWidth
                                value={selectedTable}
                                onChange={(e) => setSelectedTable(e.target.value)}
                                displayEmpty
                            >
                                <MenuItem value="">Select Table</MenuItem>
                                {Array.from({ length: 20 }, (_, i) => (
                                    <MenuItem key={i + 1} value={i + 1}>
                                        Table {i + 1}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>
                    </Grid>
                </StyledPaper>

                <Box sx={{ mb: 3, display: "flex", flexWrap: "wrap" }}>
                    {categories.map((category) => (
                        <CategoryButton
                            key={category}
                            selected={selectedCategory === category}
                            onClick={() => setSelectedCategory(category)}
                            variant="contained"
                        >
                            {category}
                        </CategoryButton>
                    ))}
                </Box>

                <StyledPaper>
                    <Typography variant="h6" gutterBottom>
                        Customizations
                    </Typography>
                    {(selectedCategory === "Beef" || selectedCategory === "Chicken") && (
                        <>
                            <Typography variant="subtitle1">Meat Options</Typography>
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

                            <Typography variant="subtitle1">Noodle Type</Typography>
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

                            <Typography variant="subtitle1">Preferences</Typography>
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
                        rows={2}
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
                    <Typography variant="h6" gutterBottom>
                        Order Summary
                    </Typography>
                    {selectedItems.map((item) => (
                        <OrderItem
                            key={item.id}
                            selected={selectedOrderItem?.id === item.id}
                            onClick={() => setSelectedOrderItem(item)}
                        >
                            <Grid container alignItems="center" spacing={2}>
                                <Grid item xs>
                                    <Typography variant="subtitle1">{item.category}</Typography>
                                    {item.pho.meat && (
                                        <Typography variant="body2">
                                            Meat: {item.pho.meat}
                                        </Typography>
                                    )}
                                    {item.pho.noodle && (
                                        <Typography variant="body2">
                                            Noodle: {item.pho.noodle}
                                        </Typography>
                                    )}
                                    {item.pho.preferences && item.pho.preferences.length > 0 && (
                                        <Typography variant="body2">
                                            Preferences: {item.pho.preferences.join(", ")}
                                        </Typography>
                                    )}
                                    {item.pho.notes && (
                                        <Typography variant="body2">Notes: {item.pho.notes}</Typography>
                                    )}
                                </Grid>
                                <Grid item>
                                    <IconButton
                                        color="error"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoveItem(item.id);
                                        }}
                                    >
                                        <FaTrash />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </OrderItem>
                    ))}

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
            </Box>
        </Container>
    );
};

export default WaiterInterface;