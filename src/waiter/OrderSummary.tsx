import React, { useState } from 'react';

import { SelectedItem } from 'myTypes';
import { FaTrash } from 'react-icons/fa';

import {
  Box,
  BoxProps,
  Grid,
  IconButton,
  styled,
  Typography,
} from '@mui/material';

interface StyledBoxProps extends BoxProps {
    selected?: boolean;
}

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

type Props = {
    selectedItems: SelectedItem[],
    setSelectedItems(selectedItems: SelectedItem[]): void;
};

const OrderSummary = ({ selectedItems, setSelectedItems }: Props) => {
    const [selectedOrderItem, setSelectedOrderItem] = useState<SelectedItem>({} as SelectedItem);

    const handleRemoveItem = (itemId: number) => {
        setSelectedItems(selectedItems.filter((item) => item.id !== itemId));
    };

    return (
        <Box>
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
                            {item.pho.meats && item.pho.meats.length > 0 && (
                                <Typography variant="body2">
                                    Meat: {item.pho.meats}
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
        </Box>
    )
}

export default OrderSummary;
