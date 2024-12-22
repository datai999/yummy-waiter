import React, { useState } from 'react';

import {
    NonPhoCode,
    PhoCode,
    SelectedItem,
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
    Button,
    Divider,
    Grid2,
    List,
    ListItemButton,
    ListItemText,
    Typography,
} from '@mui/material';

import { SideItemList } from '../my/my-component';
import { Categories } from '../my/my-constants';
import { generateId } from '../my/my-service';
import {
    OrderItem,
    StyledPaper,
} from '../my/my-styled';
import { Draggable } from './BagDnd';

interface Props {
    bag: number,
    selectedItems: SelectedItem,
    phoId: String;
    showPho?: (bag: number, category: Categories, itemId: string) => void;
};

const OrderSummary = ({ bag, selectedItems, phoId, showPho }: Props) => {
    const [refresh, setRefresh] = useState<Boolean>(false);

    return (
        <>
            <Grid2 container spacing={2}>
                {selectedItems.beef.size + selectedItems.beefSide.size > 0 && (
                    <Grid2 size={{ xs: 12, sm: showPho ? 6 : 12, md: showPho ? 4 : 'grow' }} >
                        <PhoList bag={bag} category={Categories.BEEF} phoId={phoId} phos={selectedItems.beef} sideOrders={selectedItems.beefSide}
                            showPho={showPho} />
                    </Grid2>)}
                {selectedItems.chicken.size + selectedItems.chickenSide.size > 0 && (
                    <Grid2 size={{ xs: 12, sm: showPho ? 6 : 12, md: showPho ? 4 : 'grow' }} >
                        <PhoList bag={bag} category={Categories.CHICKEN} phoId={phoId} phos={selectedItems.chicken} sideOrders={selectedItems.chickenSide}
                            showPho={showPho} />
                    </Grid2>)}
                {selectedItems.drink.size + selectedItems.dessert.size > 0 && (
                    <Grid2 size={{ xs: 12, sm: showPho ? 6 : 12, md: showPho ? 4 : 'grow' }} >
                        <DrinkDessertList canEdit={Boolean(showPho)} drinks={selectedItems.drink} desserts={selectedItems.dessert} />
                    </Grid2>)}
            </Grid2>
        </ >
    )
}

interface PhoListProps {
    bag: number,
    category: Categories,
    phoId: String,
    phos: Map<String, PhoCode>,
    sideOrders: Map<String, NonPhoCode>,
    showPho?: (bag: number, category: Categories, itemId: string) => void,
}

const PhoList = ({ bag, category, phoId, phos, sideOrders, showPho }: PhoListProps) => {
    const [refresh, setRefresh] = useState<Boolean>(false);

    const remove = (itemId: string) => {
        phos.delete(itemId);
        setRefresh(!refresh);
    };

    const copy = (itemId: string) => {
        const copyItem = { ...phos.get(itemId), id: generateId() } as PhoCode;
        phos.set(copyItem.id, copyItem);
        setRefresh(!refresh);
    }

    return (
        <StyledPaper sx={{ pt: 0, mb: 0, pb: 0, pl: 0, pr: 0, minWidth: '600' }}>
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
                        <OrderItem key={item.id} selected={item.id === phoId} sx={{ display: 'flex' }} style={{ backgroundColor: `${index % 2 === 1 ? '#f3f3f3' : null}` }}>
                            <Button onClick={() => { if (showPho) remove(item.id) }} sx={{ m: 0, p: 1.7, mr: 0, pr: 0, pl: 0 }} style={{ maxWidth: '40px', minWidth: '30px', maxHeight: '40px', minHeight: '30px' }}>
                                <FaMinus style={{ fontSize: 12 }} />
                            </Button>
                            <Draggable id={`${bag}_${category}_${id}`} enable={Boolean(showPho)}>
                                <ListItemButton onClick={() => {
                                    if (showPho)
                                        showPho(bag, category, item.id);
                                }} dense sx={{ p: 0, m: 0 }}>
                                    <ListItemText
                                        id={item.id}
                                        primaryTypographyProps={{ style: { fontWeight: "bold", fontSize: 16 } }}
                                        secondaryTypographyProps={{ style: { color: "#d32f2f" } }}
                                        sx={{ p: 0, m: 0 }}
                                        primary={
                                            `${item.meatCodes} (${item.noodleCode}) ${(item.preferenceCodes) ? `(${item.preferenceCodes})` : ''}`}
                                        secondary={item.note ? item.note : null}
                                    />
                                </ListItemButton>
                            </Draggable>
                            {showPho &&
                                <Button onClick={() => copy(item.id)} variant='outlined' sx={{ m: 0.5, p: 1.1, ml: 0 }} style={{ maxWidth: '30px', minWidth: '34px', maxHeight: '32px', minHeight: '23px' }}>
                                    <FaPlus style={{ fontSize: 26 }} />
                                </Button>}
                        </OrderItem>
                    );
                })}
            </List>
            {phos.size > 0 && sideOrders.size > 0 && <Divider sx={{ p: 0.5, mb: 0.5 }} />}
            <SideItemList canEdit={Boolean(showPho)} sideItems={sideOrders} />
        </StyledPaper>);
}

const DrinkDessertList = ({ canEdit, drinks, desserts }: {
    canEdit: boolean,
    drinks: Map<String, NonPhoCode>,
    desserts: Map<String, NonPhoCode>,
}) => {
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

            <Grid2 container columnSpacing={2}>
                {drinks.size > 0 &&
                    <Grid2 size={desserts.size ? 6 : 12}  >
                        <SideItemList canEdit={canEdit} sideItems={drinks} doubleCol={!desserts.size} />
                    </Grid2>}
                {desserts.size > 0 &&
                    <Grid2 size={drinks.size ? 6 : 12}  >
                        <SideItemList canEdit={canEdit} sideItems={desserts} doubleCol={!drinks.size} />
                    </Grid2>}
            </Grid2>

        </StyledPaper >);
}

export default OrderSummary;
