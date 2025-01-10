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
import { CategoryItem, ItemRef, NonPho, Pho, TrackedItem } from '../my/my-class';
import { MENU } from '../my/my-constants';

interface Props extends BagDndProps {
    bag: number,
    categoryItems: Map<String, CategoryItem>,
};

const OrderSummary = (props: Props) => {
    const mdResponsive = props.showPho ? useMediaQuery('(min-width:900px)') ? 12 : 4 : 'grow';

    return (
        <Grid2 container spacing={0.5} direction='row' sx={{ minHeight: props.bag === 0 ? 200 : 30 }}>
            {Object.keys(MENU)
                .filter(category => {
                    const categoryItem = props.categoryItems.get(category)!;
                    return categoryItem.getPhoQty() + categoryItem.getNonPhoQty() > 0;
                })
                .map(category => (
                    <Grid2 key={category} size={{ xs: 12, sm: props.showPho ? 4 : 12, md: mdResponsive }} >
                        <PhoList key={category} props={{ ...props, category }} />
                    </Grid2>
                ))
            }
        </Grid2>
    )
}

interface PhoListProps extends Props {
    category: string
}
const PhoList = ({ props }: { props: PhoListProps }) => {
    const [refresh, setRefresh] = useState<Boolean>(false);

    const category = props.category;
    const categoryItems = props.categoryItems.get(category)!;

    const phoQty = categoryItems.getPhoQty();
    const nonPhoQty = categoryItems.getNonPhoQty();

    const copyItem = (trackedIndex: number, item: any, qty: number) => {
        const itemRef = qty > 0 ? null : new ItemRef(trackedIndex, item.id);
        const qtyValue = qty > 0 ? qty : -1 * qty;
        const copyItem = { ...item, qty: qtyValue, actualQty: qtyValue, id: generateId(), void: itemRef };
        if (item.meats) categoryItems.lastPhos().set(copyItem.id, copyItem);
        else categoryItems.lastNonPhos().set(copyItem.id, copyItem);
        setRefresh(!refresh);
    }

    return (
        <StyledPaper sx={{ pt: 0, mb: 0, pb: 0, pl: 0, pr: 0 }}>
            <Typography variant="subtitle1" style={{ fontWeight: 'bold' }} >
                <Badge badgeContent={categoryItems.getPhoActualQty()} color="primary" anchorOrigin={{
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
            {categoryItems.pho.map((trackedItem, index) =>
                <TrackedItemsList key={index}
                    props={{
                        ...props,
                        refreshPhoList: () => setRefresh(!refresh),
                        trackedItem: trackedItem,
                        trackedIndex: index,
                        draggablePrefix: 'pho',
                        renderPrimaryContent: (item: Pho) => (`${item.void ? 'Void:' : ''}${item.qty === 1 ? '' : item.qty + ' '}${item.meats.length % 6 === 0 ? item.code : item.meats.join(',')} (${item.noodle}) ${item.referCode}`),
                        copyItem: copyItem
                    }}
                />)
            }
            {phoQty > 0 && nonPhoQty > 0 && <Divider sx={{ p: 0.5, mb: 0.5 }} />}
            {categoryItems.nonPho.map((trackedItem, index) =>
                <TrackedItemsList key={index}
                    props={{
                        ...props,
                        refreshPhoList: () => setRefresh(!refresh),
                        trackedItem: trackedItem,
                        trackedIndex: index,
                        draggablePrefix: 'nonPho',
                        renderPrimaryContent: (item: NonPho) => (`${item.void ? 'Void:' : ''}${item.qty === 1 ? '' : item.qty} ${item.code}`),
                        copyItem: copyItem
                    }}
                />)}
        </StyledPaper>);
}

interface TrackedItemsListProps extends PhoListProps {
    refreshPhoList: () => void,
    trackedItem: TrackedItem & { items: Map<String, any> },
    trackedIndex: number,
    draggablePrefix: string,
    renderPrimaryContent: (item: any) => ReactNode,
    copyItem: (trackedIndex: number, item: any, qty: number) => void,
}

const TrackedItemsList = ({ props }: { props: TrackedItemsListProps }) => {
    const [refresh, setRefresh] = useState<Boolean>(false);

    if (props.trackedItem.items.size === 0) return (<></>);

    return (<Box key={props.trackedItem.time?.toLocaleString()}>
        <Typography variant='caption' sx={{ ml: 1 }}>
            {`${props.trackedItem.time?.toLocaleTimeString() || ''} ${props.trackedItem.server}`}
        </Typography>
        <List dense sx={{ width: '100%', p: 0 }}>
            {Array.from(props.trackedItem.items.entries()).map(([id, item], index) => {
                return (<ItemList key={index}
                    props={{
                        ...props,
                        item: item
                    }} />);
            })}
        </List>
    </Box>);
}

interface ItemListProps extends TrackedItemsListProps {
    item: NonPho & {}
}
const ItemList = ({ props }: { props: ItemListProps }) => {
    const secondaryRef = React.useRef<HTMLInputElement>();
    const [refresh, setRefresh] = useState<Boolean>(false);
    const [note, setNote] = useState(props.item.note || null || undefined);

    const category = props.category;
    const bag = props.bag;
    const phoId = props.phoId;
    const showPho = props.showPho;
    const item = props.item;

    useEffect(() => {
        if (note === ' ')
            secondaryRef.current?.focus();
    }, [note]);

    useEffect(() => {
        setNote(props.item.note);
    }, [props.item.note]);

    const minus = () => {
        if (item.actualQty < 1) return;
        if (props.trackedItem.time) {
            props.copyItem(props.trackedIndex, item, -1);
            item.actualQty--;
            return;
        }
        if (item.qty > 1) {
            item.qty--;
            item.actualQty--;
        } else props.trackedItem.items.delete(item.id);
        if (item.void) {
            const categoryItem = props.categoryItems.get(category)!;
            const refItem = (props.draggablePrefix === 'pho' ? categoryItem.pho : categoryItem.nonPho)
            [item.void.trackedIndex].items.get(item.void.id)!;
            refItem.actualQty++;
        }
        props.refreshPhoList();
    }

    const plus = () => {
        if (props.trackedItem.time) {
            props.copyItem(props.trackedIndex, item, 1);
            return;
        }
        if (item.void) {
            const categoryItem = props.categoryItems.get(category)!;
            const refItem = (props.draggablePrefix === 'pho' ? categoryItem.pho : categoryItem.nonPho)
            [item.void.trackedIndex].items.get(item.void.id)!;
            if (refItem.actualQty < 1) return;
            refItem.actualQty--;
        }
        item.qty++;
        item.actualQty++;
        props.refreshPhoList();
    }

    return (
        <OrderItem key={item.id} selected={item.id === phoId} sx={{ display: 'flex' }} style={{ backgroundColor: `${null}` }}>
            {!(props.trackedItem.time && item.void) &&
                <Button onClick={() => { if (showPho) minus() }} sx={{ m: 0, p: 1.5, pr: 0, pl: 0 }} style={{ maxWidth: '25px', minWidth: '25px', maxHeight: '30px', minHeight: '30px' }}>
                    <FaMinus style={{ fontSize: 12 }} />
                </Button>}
            <Draggable id={`${props.draggablePrefix}_${bag}_${category}_${props.trackedIndex}_${item.id}`} enable={props.bags.size > 1 && Boolean(showPho) && !props.trackedItem.time}>
                <ListItemButton
                    onClick={() => {
                        if (props.draggablePrefix === 'pho') {
                            if (showPho) {
                                showPho(bag, category, props.trackedIndex, phoId === item.id ? "" : item.id);
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
                        primaryTypographyProps={{ style: { fontWeight: "bold", fontSize: 14 } }}
                        secondaryTypographyProps={{ style: { color: "#d32f2f", fontSize: 12, padding: 0 } }}
                        sx={{ p: 0, m: 0 }}
                        primary={props.renderPrimaryContent(item)}
                        secondary={note === undefined || note === null ? null : props.draggablePrefix === 'pho' ? `${item.note}` :
                            <TextField inputRef={secondaryRef} value={note} size='small' variant="standard" margin='none'
                                InputProps={{ disableUnderline: true }} inputProps={{ style: { fontSize: 12 } }}
                                onChange={(e) => {
                                    setNote(e.target.value);
                                }}
                                onBlur={() => {
                                    let value: String = note.trim();
                                    item.note = value.length > 0 ? value : undefined;
                                    setNote(item.note);
                                }}
                            />}
                    />
                </ListItemButton>
            </Draggable>
            {showPho && !(props.trackedItem.time && item.void) &&
                <Button onClick={plus} variant='outlined' sx={{ m: 0, p: 1.1, mb: 0.2 }} style={{ maxWidth: '30px', minWidth: '34px', maxHeight: '30px', minHeight: '23px' }}>
                    <FaPlus style={{ fontSize: 14 }} />
                </Button>}
        </OrderItem>
    );
}

export default OrderSummary;
