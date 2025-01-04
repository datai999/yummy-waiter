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
    Box,
    Button,
    Divider,
    Grid2,
    List,
    ListItemButton,
    ListItemText,
    Typography,
    useMediaQuery,
} from '@mui/material';

import { generateId } from '../my/my-service';
import {
    OrderItem,
    StyledPaper,
} from '../my/my-styled';
import { Draggable } from './BagDnd';
import { CategoryItem, NonPho, Pho } from '../my/my-class';
import { MENU } from '../my/my-constants';
import { NumberInput } from '../my/my-component';

interface Props {
    bag: number,
    categoryItems: Map<String, CategoryItem>,
    phoId: String;
    showPho?: (bag: number, category: string, itemId: string) => void;
};

const OrderSummary = (props: Props) => {
    const mdResponsive = props.showPho ? useMediaQuery('(min-width:900px)') ? 12 : 4 : 'grow';

    return (
        <Grid2 container spacing={2}>
            {Object.keys(MENU)
                .filter(category => {
                    // if (!MENU[category as keyof typeof MENU].pho) return false;
                    const categoryItem = props.categoryItems.get(category)!;
                    return categoryItem.lastPhos().size + categoryItem.lastNonPhos().size > 0;
                })
                .map(category => (
                    <Grid2 key={category} size={{ xs: 12, sm: props.showPho ? 6 : 12, md: mdResponsive }} >
                        <PhoList parentProps={props} category={category} />
                    </Grid2>
                ))
            }
        </Grid2>
    )
}

const PhoList = (props: { parentProps: Props, category: string }) => {
    const [refresh, setRefresh] = useState<Boolean>(false);

    const category = props.category;
    const bag = props.parentProps.bag;
    const phoId = props.parentProps.phoId;
    const showPho = props.parentProps.showPho;
    const categoryItems = props.parentProps.categoryItems.get(category);
    const phos = categoryItems?.lastPhos()!;
    const nonPhos = categoryItems?.lastNonPhos()!;

    // TODO
    const remove = (itemId: string) => {
        phos.delete(itemId);
        setRefresh(!refresh);
    };

    // TODO
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
            {categoryItems?.pho.map(trackPho => {
                const phos = trackPho.items;
                return (
                    <Box key={trackPho.time?.toLocaleString()}>
                        {`${trackPho.time?.toLocaleTimeString() || ''}:${trackPho.staff}`}
                        <List dense sx={{ width: '100%', p: 0 }}>
                            {Array.from(phos.entries()).map(([id, item], index) => {
                                return (
                                    <OrderItem key={item.id} selected={item.id === phoId} sx={{ display: 'flex' }} style={{ backgroundColor: `${index % 1 === 1 ? '#f3f3f3' : null}` }}>
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
                    </Box>
                )
            })}
            {phos.size > 0 && nonPhos.size > 0 && <Divider sx={{ p: 0.5, mb: 0.5 }} />}
            <NonPhoList bag={bag} category={category} canEdit={Boolean(showPho)} sideItems={nonPhos} doubleCol={false} />
        </StyledPaper>);
}

const NonPhoList = ({ bag, category, canEdit, sideItems, doubleCol = true }: {
    bag: number,
    category: string,
    canEdit: boolean;
    sideItems: Map<String, NonPho>,
    doubleCol?: boolean,
}) => {
    const [refresh, setRefresh] = useState<Boolean>(false);

    const copy = (itemId: String) => {
        const newItem = { ...sideItems.get(itemId), id: generateId() } as NonPho;
        sideItems.set(newItem.id, newItem);
        setRefresh(!refresh);
    }

    const remove = (itemId: String) => {
        sideItems.delete(itemId);
        setRefresh(!refresh);
    };

    return (
        <List dense sx={{ width: '100%', p: 0 }}>
            <Grid2 container columnSpacing={2}>
                {Array.from(sideItems.entries()).map(([key, value], index) => {
                    return (
                        <Grid2 key={index} size={doubleCol ? 6 : 12}  >
                            <OrderItem key={key as string} sx={{ display: 'flex' }}
                                style={{
                                    backgroundColor: `${(doubleCol
                                        ? (index % 4 === 2 || index % 4 === 3)
                                        : (index % 2 === 1))
                                        ? '#f3f3f3' : null}`
                                }}>
                                <Button onClick={() => { if (canEdit) remove(key) }}
                                    sx={{ m: 0, p: 1.7, mr: 0, pr: 0, pl: 0 }}
                                    style={{ maxWidth: '40px', minWidth: '30px', maxHeight: '40px', minHeight: '30px' }}>
                                    <FaMinus style={{ fontSize: 12 }} />
                                </Button>
                                <Draggable id={`nonPho_${bag}_${category}_${key}`} enable={canEdit}>
                                    <ListItemText
                                        id={key as string}
                                        primaryTypographyProps={{ style: { fontWeight: "bold", fontSize: 16 } }}
                                        secondaryTypographyProps={{ style: { color: "#d32f2f" } }}
                                        sx={{ p: 0, m: 0 }}
                                        primary={<NumberInput
                                            value={''}
                                            placeholder={`${value.count > 1 ? value.count : ''} ${value.code}`}
                                            onChange={num => {
                                                if (num === 0) {
                                                    remove(key);
                                                    return;
                                                }
                                                const sideItem = sideItems.get(key) || {} as NonPho;
                                                sideItem.count = num;
                                                setRefresh(!refresh);
                                            }}
                                            nonBorder={true}
                                            pl={0}
                                        />}
                                    />
                                </Draggable>
                                {canEdit && (
                                    <Button onClick={() => copy(key)} variant='outlined' sx={{ m: 0.5, p: 1.1, ml: 0 }} style={{ maxWidth: '30px', minWidth: '34px', maxHeight: '32px', minHeight: '23px' }}>
                                        <FaPlus style={{ fontSize: 26 }} />
                                    </Button>)}
                            </OrderItem>
                        </Grid2>
                    );
                })}
            </Grid2 >
        </List>
    );
}

export default OrderSummary;
