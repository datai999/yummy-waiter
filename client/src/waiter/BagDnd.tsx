import React from 'react';
import { RiDragMove2Fill } from 'react-icons/ri';

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
    Button,
    Typography,
} from '@mui/material';

import { StyledPaper } from '../my/my-styled';
import theme from '../theme';
import OrderSummary from './DetailOrder';
import { CategoryItem, NonPho, Pho } from '../my/my-class';

export interface BagDndProps {
    bags: Map<number, Map<string, CategoryItem>>,
    phoId: String;
    showPho?: (bag: number, category: string, trackIndex: number, itemId: string) => void,
};
const BagDnd = ({ bags, phoId, showPho }: BagDndProps) => {
    const [refresh, setRefresh] = React.useState(false);

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
        const itemId = ids[4];

        const overBag = Number(String(over.id).slice(-1));
        if (activeBag === overBag) return;

        const activeCategoryItem = bags.get(activeBag)?.get(category)!;
        const overCategoryItem = bags.get(overBag)?.get(category)!;

        if (type === 'pho') {
            const item = activeCategoryItem.lastPhos().get(itemId) as Pho;
            activeCategoryItem.lastPhos().delete(itemId);
            overCategoryItem.lastPhos().set(item?.id as string, item);
        } else {
            const item = activeCategoryItem.lastNonPhos().get(itemId) as NonPho;
            activeCategoryItem.lastNonPhos().delete(itemId);
            overCategoryItem.lastNonPhos().set(item?.id as string, item);
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
            {Array.from(bags.entries()).map(([key, item], index) => {
                return (
                    <Droppable id={`${key}`} key={index}>
                        <StyledPaper sx={{ mt: 0, pt: 0, mb: 1, pb: 0 }} onClick={() => { }}>
                            <Typography variant="h6" style={{ fontWeight: 'bold' }} >
                                {key === 0 ? 'Dine-in' : `Togo ${key}`}
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
        </DndContext>
    );
}

export const Draggable = (props: { id: string, children: React.ReactNode, enable: boolean }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: 'Draggable_' + props.id,
    });

    const style = {
        width: '100%', display: 'flex',
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : '',
        borderRadius: theme.shape.borderRadius,
        border: `${transform ? `3px solid ${theme.palette.primary.main}` : null}`,
        touchAction: 'none',
    };

    return (
        <Box ref={setNodeRef} style={style} >
            {props.children}
            {props.enable &&
                <Button {...listeners} {...attributes} variant='outlined' sx={{ m: 0.5, p: 0.7, ml: 0 }} style={{ maxWidth: '30px', minWidth: '34px', maxHeight: '32px', minHeight: '23px' }}>
                    <RiDragMove2Fill style={{ fontSize: 26 }} />
                </Button>}
        </Box>
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
