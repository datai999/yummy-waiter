import React, {
  useEffect,
  useState,
} from 'react';

import {
  Pho,
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
} from '../my/my-constants';
import { generateId } from '../my/my-service';
import { StyledPaper } from '../my/my-styled';

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
    setSelectedItems(selectedItem: SelectedItem): void;
};

const OrderSummary = ({ selectedItems, setSelectedItems }: Props) => {
    const [selectedOrderItem, setSelectedOrderItem] = useState<SelectedItem>({} as SelectedItem);
    const [phoBeefs, setPhoBeefs] = useState<Map<String, PhoCode>>(new Map<String, PhoCode>());
    const [phoChickens, setPhoChickens] = useState<PhoCode[]>([]);

    useEffect(() => {
        const beefs = new Map<String, PhoCode>();
        selectedItems.beef.forEach((beef: Pho, id: string) => {
            const phoCode: PhoCode = {
                ...beef,
                meats: beef.meats.map(e => BeefMeatCodes[e as keyof typeof BeefMeatCodes]).join(','),
                noodle: Noodles[beef.noodle as keyof typeof Noodles] as string,
                preferences: (beef.preferences || [])
                    .map(e => BeefPreferenceCodes[e as keyof typeof BeefPreferenceCodes])
                    .join(", ")
            }
            beefs.set(id, phoCode);
        });
        console.log("beefs", beefs);
        setPhoBeefs(beefs);
    }, [selectedItems.beef.size]);

    useEffect(() => {
        // setPhoChickens(selectedItems.chicken);
    }, [selectedItems.chicken]);

    const removeBeef = (itemId: string) => {
        const newSelectedItems = { ...selectedItems };
        newSelectedItems.beef.delete(itemId);
        setSelectedItems(newSelectedItems);
    };

    const copyBeef = (itemId: string) => {
        const newBeef = { ...selectedItems.beef.get(itemId) } as Pho;
        newBeef.id = generateId();
        const newItem = { ...selectedItems };
        newItem.beef.set(newBeef.id, newBeef);
        setSelectedItems(newItem);
    }

    return (
        <Box>
            {phoBeefs.size > 0 && (
                <StyledPaper sx={{ pt: 0, mb: 0, pb: 0, pl: 0, pr: 0, maxWidth: 360, }}>
                    <Typography variant="h6" >
                        <Badge badgeContent={phoBeefs.size} color="primary" anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                            sx={{ mb: 0, pb: 0, ml: 1 }}>
                            BEEF
                            <PiCow style={{ fontSize: 30, marginLeft: 6 }} />
                        </Badge>
                    </Typography>
                    <Divider />

                    <List dense sx={{ width: '100%', p: 0 }}>
                        {Array.from(phoBeefs.entries()).map(([id, item], index) => {
                            return (
                                <Box key={item.id} sx={{ display: 'flex' }} style={{ backgroundColor: `${index % 2 === 1 ? '#f3f3f3' : null}` }}>
                                    <Button onClick={() => removeBeef(item.id)} sx={{ m: 0, p: 1.7, mr: 0, pr: 0, pl: 0 }} style={{ maxWidth: '40px', minWidth: '30px', maxHeight: '30px', minHeight: '30px' }}>
                                        <FaMinus style={{ fontSize: 12 }} />
                                    </Button>
                                    <ListItem
                                        key={item.toString()}
                                        dense
                                        disablePadding
                                        style={{ maxHeight: '30px' }}
                                        sx={{ p: 2, m: 0, pl: 0, pr: 0 }}

                                    >
                                        <ListItemButton dense sx={{ p: 0, m: 0 }}>
                                            <ListItemText
                                                id={item.id}
                                                primaryTypographyProps={{ style: { fontWeight: "bold", fontSize: 16 } }}
                                                secondaryTypographyProps={{ style: { color: "#d32f2f" } }}
                                                sx={{ p: 0, m: 0 }}
                                                primary={
                                                    `${item.meats} (${item.noodle}) ${(item.preferences) ? `(${item.preferences})` : ''}`}
                                                secondary={item.note ? item.note : null}
                                            />
                                        </ListItemButton>
                                    </ListItem>
                                    <Button onClick={() => copyBeef(item.id)} variant='outlined' sx={{ m: 0.5, p: 1.1, ml: 0 }} style={{ maxWidth: '30px', minWidth: '30px', maxHeight: '22px', minHeight: '23px' }}>
                                        <FaPlus style={{ fontSize: 26 }} />
                                    </Button>
                                </Box>
                            );
                        })}
                    </List>
                </StyledPaper>)
            }
        </Box >
    )
}

export default OrderSummary;
