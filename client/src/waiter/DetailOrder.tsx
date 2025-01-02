import React, { useEffect, useState } from 'react';

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
    useMediaQuery,
} from '@mui/material';

import { SideItemList } from '../my/my-component';
import { generateId } from '../my/my-service';
import {
    OrderItem,
    StyledPaper,
} from '../my/my-styled';
import { Draggable } from './BagDnd';
import { CategoryItem, NonPho, Pho } from '../my/my-class';
import { MENU } from '../my/my-constants';

interface Props {
    bag: number,
    categoryItems: Map<String, CategoryItem>,
    phoId: String;
    showPho?: (bag: number, category: string, itemId: string) => void;
};

const OrderSummary = ({ bag, categoryItems, phoId, showPho }: Props) => {
    const [refresh, setRefresh] = useState<Boolean>(false);

    const mdResponsive = showPho ? useMediaQuery('(min-width:900px)') ? 12 : 4 : 'grow';

    return (
        <Grid2 container spacing={2}>
            {Object.keys(MENU)
                .filter(category => {
                    // if (!MENU[category as keyof typeof MENU].pho) return false;
                    const categoryItem = categoryItems.get(category)!;
                    return categoryItem.pho.size + categoryItem.nonPho.size > 0;
                })
                .map(category => (
                    <Grid2 key={category} size={{ xs: 12, sm: showPho ? 6 : 12, md: mdResponsive }} >
                        <PhoList bag={bag} category={category} phoId={phoId} phos={categoryItems.get(category)!.pho} sideOrders={categoryItems.get(category)!.nonPho}
                            showPho={showPho} />
                    </Grid2>
                ))
            }
        </Grid2>
    )
}

interface PhoListProps {
    bag: number,
    category: string,
    phoId: String,
    phos: Map<String, Pho>,
    sideOrders: Map<String, NonPho>,
    showPho?: (bag: number, category: string, itemId: string) => void,
}

const PhoList = ({ bag, category, phoId, phos, sideOrders, showPho }: PhoListProps) => {
    const [refresh, setRefresh] = useState<Boolean>(false);

    const remove = (itemId: string) => {
        phos.delete(itemId);
        setRefresh(!refresh);
    };

    const copy = (itemId: string) => {
        const copyItem = { ...phos.get(itemId), id: generateId() } as Pho;
        phos.set(copyItem.id, copyItem);
        setRefresh(!refresh);
    }

    return (
        <StyledPaper sx={{ pt: 0, mb: 0, pb: 0, pl: 0, pr: 0, minWidth: '600' }}>
            <Typography variant="subtitle1" style={{ fontWeight: 'bold' }} >
                <Badge badgeContent={Array.from(phos.values()).reduce((preQty, cur) => preQty + cur.qty, 0)} color="primary" anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                    sx={{ mb: 0, pb: 0, ml: 1 }}>
                    {category}
                    {category === 'BEEF' && <PiCow style={{ fontSize: 25, marginLeft: 6 }} />}
                    {category === 'CHICKEN' && <GiChicken style={{ fontSize: 25, marginLeft: 6 }} />}
                    {category === 'DRINK' && <RiDrinks2Line style={{ fontSize: 25, marginLeft: 6 }} />}
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
                            <Draggable id={`pho_${bag}_${category}_${id}`} enable={Boolean(showPho)}>
                                <ListItemButton onClick={() => {
                                    if (showPho) {
                                        if (phoId === item.id)
                                            showPho(bag, category, "");
                                        else
                                            showPho(bag, category, item.id);
                                    }
                                }} dense sx={{ p: 0, m: 0 }}>
                                    <ListItemText
                                        id={item.id}
                                        primaryTypographyProps={{ style: { fontWeight: "bold", fontSize: 16 } }}
                                        secondaryTypographyProps={{ style: { color: "#d32f2f" } }}
                                        sx={{ p: 0, m: 0 }}
                                        primary={
                                            `${item.qty < 2 ? '' : item.qty + ' '}${item.meats.length === 6 ? 'DB' : item.meats} (${item.noodle}) ${(item.preferences || [])}`}
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
            <SideItemList bag={bag} category={category} canEdit={Boolean(showPho)} sideItems={sideOrders} doubleCol={false} />
        </StyledPaper>);
}

export default OrderSummary;
