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

    return (
        <StyledPaper sx={{ pt: 0, mb: 0, pb: 0, pl: 0, pr: 0 }}>
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
            {categoryItems.pho.map((trackedItem, index) =>
                <TrackedItemsList key={index}
                    props={{
                        ...props,
                        refreshPhoList: () => setRefresh(!refresh),
                        trackedItem: trackedItem,
                        trackedIndex: index,
                        draggablePrefix: 'pho',
                        renderPrimaryContent: (item: Pho) => (`${item.qty < 2 ? '' : item.qty + ' '}${item.code} (${item.noodle}) ${item.referCode}`),
                    }}
                />)}
            {phoQty > 0 && nonPhoQty > 0 && <Divider sx={{ p: 0.5, mb: 0.5 }} />}
            {categoryItems.nonPho.map((trackedItem, index) =>
                <TrackedItemsList key={index}
                    props={{
                        ...props,
                        refreshPhoList: () => setRefresh(!refresh),
                        trackedItem: trackedItem,
                        trackedIndex: index,
                        draggablePrefix: 'nonPho',
                        renderPrimaryContent: (item: NonPho) => (`${item.qty > 1 ? item.qty : ''} ${item.code}`)
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
}

const TrackedItemsList = ({ props }: { props: TrackedItemsListProps }) => {
    const [refresh, setRefresh] = useState<Boolean>(false);

    const remove = (itemId: string) => {
        props.trackedItem.items.delete(itemId);
        setRefresh(!refresh);
    };

    const copy = (item: any) => {
        const copyItem = { ...item, id: generateId() };
        props.trackedItem.items.set(copyItem.id, copyItem);
        setRefresh(!refresh);
    }

    if (props.trackedItem.items.size === 0) return (<></>);

    return (<Box key={props.trackedItem.time?.toLocaleString()}>
        <Typography variant='caption' sx={{ ml: 1 }}>
            {`${props.trackedItem.time?.toLocaleTimeString() || ''} ${props.trackedItem.staff}`}
        </Typography>
        <List dense sx={{ width: '100%', p: 0 }}>
            {Array.from(props.trackedItem.items.entries()).map(([id, item], index) => {
                return (<ItemList key={index}
                    props={{
                        ...props,
                        item: item,
                        remove: remove
                    }} />);
            })}
        </List>
    </Box>);
}

interface ItemListProps extends TrackedItemsListProps {
    item: any,
    remove: (item: any) => void,
}
const ItemList = ({ props }: { props: ItemListProps }) => {
    const secondaryRef = React.useRef<HTMLInputElement>();
    const [refresh, setRefresh] = useState<Boolean>(false);
    const [note, setNote] = useState(props.item.note || null);

    const category = props.category;
    const bag = props.bag;
    const phoId = props.phoId;
    const showPho = props.showPho;
    const item = props.item;

    useEffect(() => {
        if (note === ' ')
            secondaryRef.current?.focus();
    }, [note]);

    const minus = (item: any) => {
        const itemId = props.draggablePrefix === 'pho' ? item.id : item.code;
        if (item.qty > 1) {
            item.qty--;
            props.refreshPhoList();
        } else props.remove(itemId);
    }

    const plus = (item: any) => {
        item.qty++;
        props.refreshPhoList();
    }

    return (
        <OrderItem key={item.id} selected={item.id === phoId} sx={{ display: 'flex' }} style={{ backgroundColor: `${null}` }}>
            <Button onClick={() => { if (showPho) minus(item) }} sx={{ m: 0, p: 1.5, pr: 0, pl: 0 }} style={{ maxWidth: '25px', minWidth: '25px', maxHeight: '30px', minHeight: '30px' }}>
                <FaMinus style={{ fontSize: 12 }} />
            </Button>
            <Draggable id={`${props.draggablePrefix}_${bag}_${category}_${props.trackedIndex}_${props.draggablePrefix === 'pho' ? item.id : item.code}`} enable={props.bags.size > 1 && Boolean(showPho)}>
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
                                    item.note = value.length > 0 ? value : null;
                                    setNote(item.note);
                                }}
                            />}
                    />
                </ListItemButton>
            </Draggable>
            {showPho &&
                <Button onClick={() => plus(item)} variant='outlined' sx={{ m: 0, p: 1.1, mb: 0.2 }} style={{ maxWidth: '30px', minWidth: '34px', maxHeight: '30px', minHeight: '23px' }}>
                    <FaPlus style={{ fontSize: 14 }} />
                </Button>}
        </OrderItem>
    );
}

export default OrderSummary;
