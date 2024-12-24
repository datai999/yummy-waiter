import React from 'react';

import {
    Pho,
    SelectedItem,
} from 'myTypes';
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

import { Categories } from '../my/my-constants';
import { StyledPaper } from '../my/my-styled';
import theme from '../theme';
import OrderSummary from './DetailOrder';

interface Props {
    bags: Map<number, SelectedItem>,
    phoId: String;
    showPho: (bag: number, category: Categories, itemId: string) => void,
};
const BagDnd = ({ bags, phoId, showPho }: Props) => {
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
        const activeBag = Number(ids[1])
        const category = ids[2];
        const itemId = ids[3];

        const overBag = Number(String(over.id).slice(-1));
        if (activeBag === overBag) return;

        const selectedItem = bags.get(activeBag);
        if (category === Categories.BEEF) {
            const item = selectedItem?.beef.get(itemId) as Pho;
            selectedItem?.beef.delete(itemId);
            bags.get(overBag)?.beef.set(item?.id as string, item);
        } else if (category === Categories.CHICKEN) {
            const item = selectedItem?.chicken.get(itemId) as Pho;
            selectedItem?.chicken.delete(itemId);
            bags.get(overBag)?.chicken.set(item?.id as string, item);
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
                                bag={key}
                                selectedItems={item}
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
