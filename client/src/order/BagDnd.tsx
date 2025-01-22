import React, { useContext, useState } from 'react';
import { RiDragMove2Fill } from 'react-icons/ri';
import { CSS } from '@dnd-kit/utilities';

import {
    DndContext,
    DragEndEvent,
    MouseSensor,
    PointerSensor,
    TouchSensor,
    useDraggable,
    useDroppable,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    Box,
    BoxProps,
    Button,
    styled,
    TextField,
    Typography,
} from '@mui/material';

import { StyledPaper } from '../my/my-styled';
import theme from '../theme';
import OrderSummary from '../order/DetailOrder';
import { CategoryItem, NonPho, Pho } from '../my/my-class';
import { CONTEXT } from '../App';

export interface BagDndProps {
    bags: Map<number, Map<string, CategoryItem>>,
    phoId: String;
    showPho?: (isPho: boolean, bag: number, category: string, trackIndex: number, itemId: string) => void,
};
const BagDnd = ({ bags, phoId, showPho }: BagDndProps) => {
    const { table } = useContext(CONTEXT.Table);
    const [refresh, setRefresh] = React.useState(false);

    const lockedTable = Boolean(useContext(CONTEXT.LockedTable)(table.id));

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(MouseSensor),
        useSensor(TouchSensor),
        // useSensor(KeyboardSensor)
        // useSensor(MouseSensor, {
        //     // Press delay of 250ms, with tolerance of 5px of movement
        //     activationConstraint: {
        //         distance: 10,
        //         delay: 0,
        //         tolerance: 0,
        //     },
        // }),
        // useSensor(TouchSensor, {
        //     // Press delay of 250ms, with tolerance of 5px of movement
        //     activationConstraint: {
        //         delay: 0,
        //         tolerance: 0,
        //     },
        // }),
    );

    const onDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over) return;

        const ids = String(active.id).split('_');
        const type = ids[1];
        const activeBag = Number(ids[2])
        const category = ids[3];
        const trackedIndex = Number(ids[4]);
        const itemId = ids[5];

        const overBag = Number(String(over.id).slice(-1));
        if (activeBag === overBag) return;

        const activeCategoryItem = bags.get(activeBag)?.get(category)!;
        const overCategoryItem = bags.get(overBag)?.get(category)!;

        if (type === 'pho') {
            const item = activeCategoryItem.pho[trackedIndex].items.get(itemId) as Pho;
            activeCategoryItem.pho[trackedIndex].items.delete(itemId);
            overCategoryItem.lastPhos().set(item?.id as string, item);
        } else {
            const item = activeCategoryItem.nonPho[trackedIndex].items.get(itemId) as NonPho;
            activeCategoryItem.nonPho[trackedIndex].items.delete(itemId);
            overCategoryItem.lastNonPhos().set(item?.code as string, item);
        }

        setRefresh(!refresh);
    }

    return (
        <DndContext
            // sensors={sensors}
            // collisionDetection={closestCenter}
            // onDragStart={handleDragStart}
            onDragEnd={onDragEnd}
        >
            <Box style={{ maxHeight: 480, overflow: 'auto' }}>
                {Array.from(bags.entries()).map(([key, item], index) => {
                    return (
                        <Droppable id={`${key}`} key={index}>
                            <StyledPaper sx={{ m: 0, mb: 1, p: 0, border: 'solid 0.1px' }} onClick={() => { }}>
                                <Typography variant="h6" style={{ fontWeight: 'bold' }} sx={{ ml: 0.5 }} >
                                    {table.id.startsWith('Togo')
                                        ? `Togo ${key + 1}`
                                        : key === 0 ? 'Dine-in' : bags.size > 2 ? `Togo ${key}` : 'Togo'}
                                </Typography>

                                <OrderSummary
                                    key={index}
                                    bags={bags}
                                    bag={key}
                                    categoryItems={item}
                                    phoId={phoId} showPho={showPho}
                                />

                            </StyledPaper>
                        </Droppable>
                    );
                })}
            </Box>
        </DndContext>
    );
}

interface StyledBoxProps extends BoxProps {
    hover: Boolean;
}

const DragableBox = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'hover',
})<StyledBoxProps>(({ theme, hover }) => ({
    "&:hover": {
        border: hover ? `3px solid ${theme.palette.primary.main}` : null,
    },
}));

export const Draggable = (props: { id: string, children: React.ReactNode, enable: boolean }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: 'Draggable_' + props.id,
    });

    const style = {
        width: '100%', display: 'flex',
        transform: CSS.Translate.toString(transform),
        borderRadius: theme.shape.borderRadius,
        touchAction: 'none',
    };

    return (
        <Box ref={setNodeRef} style={style}  >
            {props.children}
            {props.enable &&
                <Button {...listeners} {...attributes} variant='outlined' sx={{ m: 0, p: 0.7 }} style={{ maxWidth: '30px', minWidth: '30px', maxHeight: '30px', minHeight: '23px' }}>
                    <RiDragMove2Fill style={{ fontSize: 26 }} />
                </Button>}
        </Box >
    );
}

export const Droppable = (props: { id: string, children: React.ReactNode, }) => {
    const { isOver, setNodeRef } = useDroppable({
        id: 'Droppable_' + props.id,
    });
    const style = {
        color: isOver ? 'green' : undefined,
    };

    return (
        <Box ref={setNodeRef} style={style}>
            {props.children}
        </Box>
    );
}

export default BagDnd;
