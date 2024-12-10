import React, {
  useEffect,
  useState,
} from 'react';

import {
  Pho,
  PhoCode,
  SelectedItem,
  SideItem,
} from 'myTypes';
import {
  FaMinus,
  FaPlus,
} from 'react-icons/fa';
import { GiChicken } from 'react-icons/gi';
import { PiCow } from 'react-icons/pi';
import { RiDrinks2Line } from 'react-icons/ri';

import {
  Badge,
  Box,
  Button,
  Divider,
  Grid2,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';

import { SideItemList } from '../my/my-component';
import {
  BeefMeatCodes,
  BeefPreferenceCodes,
  Categories,
  ChickenMeats,
  ChikenPreferences,
  Noodles,
} from '../my/my-constants';
import { generateId } from '../my/my-service';
import {
  OrderItem,
  StyledPaper,
} from '../my/my-styled';

type Props = {
    selectedItems: SelectedItem,
    setSelectedItems(selectedItem: SelectedItem): void;
    phoId: String;
    showPho: (category: Categories, itemId: string) => void;
};

const OrderSummary = ({ selectedItems, setSelectedItems, phoId, showPho }: Props) => {
    const [phoBeefs, setPhoBeefs] = useState<Map<String, PhoCode>>(new Map<String, PhoCode>());
    const [phoChickens, setPhoChickens] = useState<Map<String, PhoCode>>(new Map<String, PhoCode>());

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
    }, [selectedItems.beef.size, selectedItems.beefUpdated]);

    useEffect(() => {
        const chickens = new Map<String, PhoCode>();
        selectedItems.chicken.forEach((chicken: Pho, id: string) => {
            const phoCode: PhoCode = {
                ...chicken,
                meats: chicken.meats.map(e => ChickenMeats[e as keyof typeof ChickenMeats]).join(','),
                noodle: Noodles[chicken.noodle as keyof typeof Noodles] as string,
                preferences: (chicken.preferences || [])
                    .map(e => ChikenPreferences[e as keyof typeof ChikenPreferences])
                    .join(", ")
            }
            chickens.set(id, phoCode);
        });
        console.log("beefs", chickens);
        setPhoChickens(chickens);
    }, [selectedItems.chicken.size, selectedItems.chickenUpdated]);

    const removeItem = (category: Categories, itemId: string) => {
        const newSelectedItems = { ...selectedItems };
        if (Categories.BEEF === category)
            newSelectedItems.beef.delete(itemId);
        else if (Categories.CHICKEN === category)
            newSelectedItems.chicken.delete(itemId);
        setSelectedItems(newSelectedItems);
    };

    const copyItem = (category: Categories, itemId: string) => {
        const newItems = { ...selectedItems };
        if (Categories.BEEF === category) {
            const copyItem = { ...selectedItems.beef.get(itemId) } as Pho;
            copyItem.id = generateId();
            newItems.beef.set(copyItem.id, copyItem);
        }
        else if (Categories.CHICKEN === category) {
            const copyItem = { ...selectedItems.chicken.get(itemId) } as Pho;
            copyItem.id = generateId();
            newItems.chicken.set(copyItem.id, copyItem);
        }
        setSelectedItems(newItems);
    }

    return (
        <Box>
            <Grid2 container spacing={2}>
                {phoBeefs.size + selectedItems.beefSide.size > 0 && (
                    <Grid2 size={{ xs: 12, sm: 6, md: 4 }}  >
                        <PhoList category={Categories.BEEF} phoId={phoId} phos={phoBeefs} sideOrders={selectedItems.beefSide}
                            showPho={showPho} copy={copyItem} remove={removeItem} />
                    </Grid2>)}
                {phoChickens.size + selectedItems.chickenSide.size > 0 && (
                    <Grid2 size={{ xs: 12, sm: 6, md: 4 }}  >
                        <PhoList category={Categories.CHICKEN} phoId={phoId} phos={phoChickens} sideOrders={selectedItems.chickenSide}
                            showPho={showPho} copy={copyItem} remove={removeItem} />
                    </Grid2>)}
                {selectedItems.drink.size + selectedItems.dessert.size > 0 && (
                    <Grid2 size={{ xs: 12, sm: 6, md: 4 }}  >
                        <DrinkDessertList drinks={selectedItems.drink} desserts={selectedItems.dessert} />
                    </Grid2>)}
            </Grid2>
        </Box >
    )
}

type PhoListProps = {
    category: Categories,
    phoId: String,
    phos: Map<String, PhoCode>,
    sideOrders: Map<String, String>;
    showPho: (category: Categories, itemId: string) => void;
    copy: (category: Categories, itemId: string) => void,
    remove: (category: Categories, itemId: string) => void,
}

const PhoList = ({ category, phoId, phos, sideOrders, showPho, copy, remove, }: PhoListProps) => {

    const [refresh, setRefresh] = useState<Boolean>(false);

    const copySideOrder = (itemId: String) => {
        sideOrders.set(generateId(), sideOrders.get(itemId) as string);
        setRefresh(!refresh);
    }

    const removeSideOrder = (itemId: String) => {
        sideOrders.delete(itemId);
        setRefresh(!refresh);
    };

    return (
        <StyledPaper sx={{ pt: 0, mb: 0, pb: 0, pl: 0, pr: 0 }}>
            <Typography variant="subtitle1" style={{ fontWeight: 'bold' }} >
                <Badge badgeContent={phos.size} color="primary" anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                    sx={{ mb: 0, pb: 0, ml: 1 }}>
                    {category}
                    {category === Categories.BEEF && <PiCow style={{ fontSize: 25, marginLeft: 6 }} />}
                    {category === Categories.CHICKEN && <GiChicken style={{ fontSize: 25, marginLeft: 6 }} />}
                </Badge>
            </Typography>
            <Divider />

            <List dense sx={{ width: '100%', p: 0 }}>
                {Array.from(phos.entries()).map(([id, item], index) => {
                    return (
                        <OrderItem key={item.id} selected={item.id === phoId} sx={{ display: 'flex' }}
                            style={{ backgroundColor: `${index % 2 === 1 ? '#f3f3f3' : null}` }}>
                            <Button onClick={() => remove(category, item.id)} sx={{ m: 0, p: 1.7, mr: 0, pr: 0, pl: 0 }} style={{ maxWidth: '40px', minWidth: '30px', maxHeight: '40px', minHeight: '30px' }}>
                                <FaMinus style={{ fontSize: 12 }} />
                            </Button>
                            <ListItemButton onClick={() => {
                                showPho(category, item.id);
                            }} dense sx={{ p: 0, m: 0 }}>
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
                            <Button onClick={() => copy(category, item.id)} variant='outlined' sx={{ m: 0.5, p: 1.1, ml: 0 }} style={{ maxWidth: '30px', minWidth: '34px', maxHeight: '32px', minHeight: '23px' }}>
                                <FaPlus style={{ fontSize: 26 }} />
                            </Button>
                        </OrderItem>
                    );
                })}
            </List>
            {phos.size > 0 && sideOrders.size > 0 && <Divider sx={{ p: 0.5, mb: 0.5 }} />}
            <List dense sx={{ width: '100%', p: 0 }}>
                {Array.from(sideOrders.entries()).map(([key, value], index) => {
                    return (
                        <OrderItem key={key as string} sx={{ display: 'flex' }}
                            style={{ backgroundColor: `${index % 2 === 1 ? '#f3f3f3' : null}` }}>
                            <Button onClick={() => removeSideOrder(key)} sx={{ m: 0, p: 1.7, mr: 0, pr: 0, pl: 0 }} style={{ maxWidth: '40px', minWidth: '30px', maxHeight: '40px', minHeight: '30px' }}>
                                <FaMinus style={{ fontSize: 12 }} />
                            </Button>
                            <ListItemButton onClick={() => {
                                // showPho(category, item.id);
                            }} dense sx={{ p: 0, m: 0 }}>
                                <ListItemText
                                    id={key as string}
                                    primaryTypographyProps={{ style: { fontWeight: "bold", fontSize: 16 } }}
                                    secondaryTypographyProps={{ style: { color: "#d32f2f" } }}
                                    sx={{ p: 0, m: 0 }}
                                    primary={
                                        value
                                    }
                                />
                            </ListItemButton>
                            <Button onClick={() => copySideOrder(key)} variant='outlined' sx={{ m: 0.5, p: 1.1, ml: 0 }} style={{ maxWidth: '30px', minWidth: '34px', maxHeight: '32px', minHeight: '23px' }}>
                                <FaPlus style={{ fontSize: 26 }} />
                            </Button>
                        </OrderItem>
                    );
                })}
            </List>
        </StyledPaper>);
}

type DrinkDessertListProps = {
    drinks: Map<String, SideItem>,
    desserts: Map<String, SideItem>,
}

const DrinkDessertList = ({ drinks, desserts }: DrinkDessertListProps) => {
    return (
        <StyledPaper sx={{ pt: 0, mb: 0, pb: 0, pl: 0, pr: 0 }}>
            <Typography variant="subtitle1" style={{ fontWeight: 'bold' }} >
                <Badge badgeContent={drinks.size + desserts.size} color="primary" anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                    sx={{ mb: 0, pb: 0, ml: 1 }}>
                    DRINK & DESSERTS
                    <RiDrinks2Line style={{ fontSize: 25, marginLeft: 6 }} />
                </Badge>
            </Typography>
            <Divider />

            <SideItemList sideItems={drinks} />
            {drinks.size > 0 && desserts.size > 0 && <Divider sx={{ p: 0.5, mb: 0.5 }} />}
            <SideItemList sideItems={desserts} />
        </StyledPaper >);
}

export default OrderSummary;
