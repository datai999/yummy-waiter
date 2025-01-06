import React, { ReactNode, useEffect, useState } from 'react';

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
import { CategoryItem, NonPho, Pho, TrackedItem } from '../my/my-class';
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
                        <PhoList key={category} parentProps={props} category={category} />
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
    const categoryItems = props.parentProps.categoryItems.get(category)!;

    // TODO:
    const phoQty = Array.from(categoryItems.lastPhos().values()).reduce((preQty, cur) => preQty + cur.qty, 0);
    const nonPhoQty = Array.from(categoryItems.lastNonPhos().values()).reduce((preQty, cur) => preQty + cur.qty, 0);

    return (
        <StyledPaper sx={{ pt: 0, mb: 0, pb: 0, pl: 0, pr: 0, minWidth: '600' }}>
            <Typography variant="subtitle1" style={{ fontWeight: 'bold' }} >
                <Badge badgeContent={phoQty} color="primary" anchorOrigin={{
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
            {categoryItems?.pho.map(trackPho =>
                <TrackedItemsList
                    key={trackPho.time?.toLocaleString()}
                    parentProps={props.parentProps}
                    category={category}
                    trackedItem={trackPho}
                    items={trackPho.items}
                    draggablePrefix='pho'
                    onClick={(itemId: string) => {
                        if (showPho) {
                            showPho(bag, category, phoId === itemId ? "" : itemId);
                        }
                    }}
                    renderPrimaryContent={(item: Pho) => (
                        `${item.qty < 2 ? '' : item.qty + ' '}${item.meats.length === 6 ? 'DB' : item.meats} (${item.noodle}) ${(item.preferences || [])}`
                    )}
                />)}
            {phoQty > 0 && nonPhoQty > 0 && <Divider sx={{ p: 0.5, mb: 0.5 }} />}
            {categoryItems?.nonPho.map(trackedItems =>
                <TrackedItemsList
                    key={trackedItems.time?.toLocaleString()}
                    parentProps={props.parentProps}
                    category={category}
                    trackedItem={trackedItems}
                    items={trackedItems.items}
                    draggablePrefix='nonPho'
                    onClick={() => { }}
                    renderPrimaryContent={(item: NonPho) => (<NumberInput
                        value={''}
                        placeholder={`${item.qty > 1 ? item.qty : ''} ${item.code}`}
                        onChange={num => {
                            if (num === 0) {
                                // remove(key);
                                return;
                            }
                            // const sideItem = sideItems.get(key) || {} as NonPho;
                            // sideItem.count = num;
                            // setRefresh(!refresh);
                        }}
                        nonBorder={true}
                        pl={0}
                    />)}
                />)}
        </StyledPaper>);
}

const TrackedItemsList = (props: {
    parentProps: Props,
    category: string,
    trackedItem: TrackedItem,
    items: Map<string, any>,
    draggablePrefix: string,
    onClick: (item: string) => void
    renderPrimaryContent: (item: any) => ReactNode,
}) => {
    const [refresh, setRefresh] = useState<Boolean>(false);

    const category = props.category;
    const bag = props.parentProps.bag;
    const phoId = props.parentProps.phoId;
    const showPho = props.parentProps.showPho;

    const remove = (itemId: string) => {
        props.items.delete(itemId);
        setRefresh(!refresh);
    };

    const copy = (item: any) => {
        const copyItem = { ...item, id: generateId() };
        props.items.set(copyItem.id, copyItem);
        setRefresh(!refresh);
    }

    return (<Box key={props.trackedItem.time?.toLocaleString()}>
        {`${props.trackedItem.time?.toLocaleTimeString() || ''}:${props.trackedItem.staff}`}
        <List dense sx={{ width: '100%', p: 0 }}>
            {Array.from(props.items.entries()).map(([id, item], index) => {
                return (
                    <OrderItem key={item.id} selected={item.id === phoId} sx={{ display: 'flex' }} style={{ backgroundColor: `${index % 1 === 1 ? '#f3f3f3' : null}` }}>
                        <Button onClick={() => { if (showPho) remove(item.id) }} sx={{ m: 0, p: 1.7, mr: 0, pr: 0, pl: 0 }} style={{ maxWidth: '40px', minWidth: '30px', maxHeight: '40px', minHeight: '30px' }}>
                            <FaMinus style={{ fontSize: 12 }} />
                        </Button>
                        <Draggable id={`${props.draggablePrefix}_${bag}_${category}_${id}`} enable={Boolean(showPho)}>
                            <ListItemButton onClick={() => props.onClick(item.id)} dense sx={{ p: 0, m: 0 }}>
                                <ListItemText
                                    id={item.id}
                                    primaryTypographyProps={{ style: { fontWeight: "bold", fontSize: 16 } }}
                                    secondaryTypographyProps={{ style: { color: "#d32f2f" } }}
                                    sx={{ p: 0, m: 0 }}
                                    primary={props.renderPrimaryContent(item)}
                                    secondary={item.note ? item.note : null}
                                />
                            </ListItemButton>
                        </Draggable>
                        {showPho &&
                            <Button onClick={() => copy(item)} variant='outlined' sx={{ m: 0.5, p: 1.1, ml: 0 }} style={{ maxWidth: '30px', minWidth: '34px', maxHeight: '32px', minHeight: '23px' }}>
                                <FaPlus style={{ fontSize: 26 }} />
                            </Button>}
                    </OrderItem>
                );
            })}
        </List>
    </Box>);
}

export default OrderSummary;
