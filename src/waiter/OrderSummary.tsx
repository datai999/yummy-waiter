import React, {
  useEffect,
  useState,
} from 'react';

import {
  PhoCode,
  SelectedItem,
} from 'myTypes';
import {
  FaMinus,
  FaPlus,
} from 'react-icons/fa';
import { PiCow } from 'react-icons/pi';

import {
  Badge,
  Box,
  BoxProps,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';
import { styled } from '@mui/system';

import {
  BeefMeatCodes,
  BeefPreferenceCodes,
  Noodles,
} from '../my-constants';
import { StyledPaper } from '../my-styled';

interface StyledBoxProps extends BoxProps {
    selected?: boolean;
}

const OrderItem = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'selected',
})<StyledBoxProps>(({ theme, selected }) => ({
    padding: theme.spacing(0),
    marginBottom: theme.spacing(0),
    backgroundColor: selected ? "#f5f5f5" : "#fff",
    borderRadius: theme.shape.borderRadius,
    cursor: "pointer",
    transition: "all 0.3s ease",
    // border: `1px solid ${selected ? theme.palette.primary.main : "#ddd"}`,
}));

type Props = {
    selectedItems: SelectedItem,
    // setSelectedItems(selectedItems: SelectedItem[]): void;
};

const OrderSummary = ({ selectedItems }: Props) => {
    const [selectedOrderItem, setSelectedOrderItem] = useState<SelectedItem>({} as SelectedItem);
    const [phoBeefs, setPhoBeefs] = useState<PhoCode[]>([]);
    const [phoChickens, setPhoChickens] = useState<PhoCode[]>([]);

    useEffect(() => {
        const beefs: PhoCode[] = selectedItems.beef
            .map((beef) => ({
                ...beef,
                meats: beef.meats.map(e => BeefMeatCodes[e as keyof typeof BeefMeatCodes]).join(','),
                noodle: Noodles[beef.noodle as keyof typeof Noodles] as string,
                preferences: (beef.preferences || [])
                    .map(e => BeefPreferenceCodes[e as keyof typeof BeefPreferenceCodes])
                    .join(", ")
            }));
        setPhoBeefs(beefs);
    }, [selectedItems.beef]);

    useEffect(() => {
        // setPhoChickens(selectedItems.chicken);
    }, [selectedItems.chicken]);

    const handleRemoveItem = (itemId?: string) => {
        // setSelectedItems(selectedItems.filter((item) => item.id !== itemId));
    };

    return (
        <Box>
            {phoBeefs?.length >= 0 && (
                <StyledPaper sx={{ pt: 0, mb: 0, pb: 0, pl: 0, pr: 0 }}>
                    <Typography variant="h6" >
                        <Badge badgeContent={phoBeefs.length} color="primary" anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                            sx={{ mb: 0, pb: 0, ml: 1 }}>
                            BEEF
                            <PiCow style={{ fontSize: 30, marginLeft: 6 }} />
                        </Badge>
                    </Typography>
                    <Divider />

                    <List dense sx={{ width: '100%', maxWidth: 450, pt: 0, pl: 0 }}>
                        {phoBeefs.map((item) => {
                            const labelId = `checkbox-list-secondary-label-${item}`;
                            return (
                                <ListItem
                                    key={item.toString()}
                                    secondaryAction={
                                        <Button variant='outlined' sx={{}}>
                                            {/* <IconButton edge="end" aria-label="add" color="primary" size='small'> */}
                                            <FaPlus />
                                            {/* </IconButton> */}
                                        </Button>

                                    }
                                    dense
                                    disablePadding
                                >
                                    <IconButton aria-label="delete" color="primary" size='small' >
                                        <FaMinus style={{ fontSize: 16 }} />
                                    </IconButton>
                                    <ListItemButton dense sx={{ pl: 1, pr: 0 }}>
                                        <ListItemText
                                            id={labelId}
                                            primaryTypographyProps={{ style: { fontWeight: "bold", fontSize: 16 } }}
                                            secondaryTypographyProps={{ style: { color: "#d32f2f" } }}
                                            primary={
                                                `${item.meats} (${item.noodle}) ${(item.preferences) ? `(${item.preferences})` : ''}`}
                                            secondary={item.note ? item.note : null}
                                        />
                                    </ListItemButton>
                                </ListItem>
                            );
                        })}
                    </List>
                </StyledPaper>)
            }
        </Box >
    )
}

export default OrderSummary;
