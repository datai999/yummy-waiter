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
    TextField,
    Typography,
    useMediaQuery,
} from '@mui/material';

import { generateId } from '../my/my-service';
import {
    OrderItem,
    StyledPaper,
} from '../my/my-styled';
import { BagDndProps, Draggable } from './BagDnd';
import { CategoryItem, NonPho, Pho, TrackedItem } from '../my/my-class';
import { MENU } from '../my/my-constants';
import { NumberInput } from '../my/my-component';

interface Props extends BagDndProps {
    bag: number,
    categoryItems: Map<String, CategoryItem>,
};

const OrderSummary = (props: Props) => {
    const mdResponsive = props.showPho ? useMediaQuery('(min-width:900px)') ? 12 : 4 : 'grow';

    return (
        <Grid2 container spacing={2}>
            {Object.keys(MENU)
                .filter(category => {
                    const categoryItem = props.categoryItems.get(category)!;
                    return categoryItem.getPhoQty() + categoryItem.getNonPhoQty() > 0;
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
    const categoryItems = props.parentProps.categoryItems.get(category)!;

    const phoQty = categoryItems.getPhoQty();
    const nonPhoQty = categoryItems.getNonPhoQty();

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
            {categoryItems.pho.map((trackPho, index) =>
                <TrackedItemsList
                    key={index}
                    parentProps={props.parentProps}
                    category={category}
                    trackedItem={trackPho}
                    trackedIndex={index}
                    items={trackPho.items}
                    draggablePrefix='pho'
                    renderPrimaryContent={(item: Pho) => (
                        `${item.qty < 2 ? '' : item.qty + ' '}${item.meats.length === 6 ? 'DB' : item.meats} (${item.noodle}) ${(item.preferences || [])}`
                    )}
                />)}
            {phoQty > 0 && nonPhoQty > 0 && <Divider sx={{ p: 0.5, mb: 0.5 }} />}
            {categoryItems.nonPho.map((trackedItems, index) =>
                <TrackedItemsList
                    key={index}
                    parentProps={props.parentProps}
                    category={category}
                    trackedItem={trackedItems}
                    trackedIndex={index}
                    items={trackedItems.items}
                    draggablePrefix='nonPho'
                    renderPrimaryContent={(item: NonPho) => (`${item.qty > 1 ? item.qty : ''} ${item.code}`)}
                />)}
        </StyledPaper>);
}

interface TrackedItemsListProps {
    parentProps: Props,
    category: string,
    trackedItem: TrackedItem,
    trackedIndex: number,
    items: Map<string, any>,
    draggablePrefix: string,
    renderPrimaryContent: (item: any) => ReactNode,
}

const TrackedItemsList = (props: TrackedItemsListProps) => {
    const [refresh, setRefresh] = useState<Boolean>(false);

    const remove = (itemId: string) => {
        props.items.delete(itemId);
        setRefresh(!refresh);
    };

    const copy = (item: any) => {
        const copyItem = { ...item, id: generateId() };
        props.items.set(copyItem.id, copyItem);
        setRefresh(!refresh);
    }

    if (props.items.size === 0) return (<></>);

    return (<Box key={props.trackedItem.time?.toLocaleString()}>
        {`${props.trackedItem.time?.toLocaleTimeString() || ''} ${props.trackedItem.staff}`}
        <List dense sx={{ width: '100%', p: 0 }}>
            {Array.from(props.items.entries()).map(([id, item], index) => {
                return (<ItemList key={index} parentProps={props} index={index} item={item} remove={remove} />);
            })}
        </List>
    </Box>);
}

const ItemList = (param: {
    parentProps: TrackedItemsListProps
    index: number,
    item: any,
    remove: (item: any) => void,
}) => {
    const secondaryRef = React.useRef<HTMLInputElement>();
    const [refresh, setRefresh] = useState<Boolean>(false);
    const [note, setNote] = useState(param.item.note || null);

    const props = param.parentProps;

    const category = props.category;
    const bag = props.parentProps.bag;
    const phoId = props.parentProps.phoId;
    const showPho = props.parentProps.showPho;
    const item = param.item;

    useEffect(() => {
        if (note === ' ')
            secondaryRef.current?.focus();
    }, [note]);

    const minus = (item: any) => {
        const itemId = props.draggablePrefix === 'pho' ? item.id : item.code;
        if (item.qty > 1) {
            item.qty--;
            setRefresh(!refresh);
        } else param.remove(itemId);
    }

    const plus = (item: any) => {
        item.qty++;
        setRefresh(!refresh);
    }

    return (
        <OrderItem key={item.id} selected={item.id === phoId} sx={{ display: 'flex' }} style={{ backgroundColor: `${null}` }}>
            <Button onClick={() => { if (showPho) minus(item) }} sx={{ m: 0, p: 1.7, mr: 0, pr: 0, pl: 0 }} style={{ maxWidth: '40px', minWidth: '30px', maxHeight: '40px', minHeight: '30px' }}>
                <FaMinus style={{ fontSize: 12 }} />
            </Button>
            <Draggable id={`${props.draggablePrefix}_${bag}_${category}_${props.trackedIndex}_${item.id}`} enable={Boolean(showPho)}>
                <ListItemButton
                    onClick={() => {
                        if (props.draggablePrefix === 'pho') {
                            if (showPho) {
                                showPho(bag, category, param.index, phoId === item.id ? "" : item.id);
                            }
                        }
                        else {
                            if (!note) setNote(' ');
                            else secondaryRef.current?.focus();
                        }
                    }}
                    dense sx={{ p: 0, m: 0 }}>
                    <ListItemText
                        id={item.id}
                        primaryTypographyProps={{ style: { fontWeight: "bold", fontSize: 16 } }}
                        secondaryTypographyProps={{ style: { color: "#d32f2f" } }}
                        sx={{ p: 0, m: 0 }}
                        primary={props.renderPrimaryContent(item)}
                        secondary={note === undefined || note === null ? null : props.draggablePrefix === 'pho' ? `${item.note}` :
                            <TextField inputRef={secondaryRef} value={note} size='small' variant="standard" margin='none'
                                InputProps={{ disableUnderline: true }} inputProps={{ style: { fontSize: 14 } }}
                                onChange={(e) => {
                                    console.log('onChange')
                                    console.log({ '1': e.target.value })
                                    setNote(e.target.value);
                                }}
                                onBlur={() => {
                                    console.log('blurred')
                                    let value: String = note.trim();
                                    item.note = value.length > 0 ? value : null;
                                    setNote(item.note);
                                }}
                            />}
                    />
                </ListItemButton>
            </Draggable>
            {showPho &&
                <Button onClick={() => plus(item)} variant='outlined' sx={{ m: 0.5, p: 1.1, ml: 0 }} style={{ maxWidth: '30px', minWidth: '34px', maxHeight: '32px', minHeight: '23px' }}>
                    <FaPlus style={{ fontSize: 26 }} />
                </Button>}
        </OrderItem>
    );
}

export default OrderSummary;
