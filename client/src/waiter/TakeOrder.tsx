import React, {
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';

import _ from 'lodash';

import {
    Box,
    Grid2,
} from '@mui/material';

import {
    MENU,
} from '../my/my-constants';
import BagDnd from './BagDnd';
import { ChildWaiterProps } from './Waiter';
import { CategoryItem, Pho, TrackedNonPho, TrackedPho } from '../my/my-class';
import TakePho from './TakePho';
import TakeNonPho from './TakeNonPho';
import { AuthContext } from '../App';

const OrderTake = ({ props, bags }: {
    props: ChildWaiterProps,
    bags: Map<number, Map<string, CategoryItem>>
}) => {
    const { auth, logout } = useContext(AuthContext);

    const [refresh, setRefresh] = useState(false)
    const [pho, setPho] = useState<Pho>(new Pho());
    const [itemRef, setItemRef] = useState({ bag: 0, trackedIndex: 0 });

    const category = MENU[props.category as keyof typeof MENU];

    useEffect(() => {
        bags.forEach(bag => bag.forEach(categoryItem => {
            const phoLen = categoryItem.pho.length;
            if (phoLen === 0 || (phoLen > 0 && categoryItem.pho[phoLen - 1].time))
                categoryItem.pho.push(new TrackedPho(auth));
            const nonPhoLen = categoryItem.nonPho.length;
            if (nonPhoLen === 0 || (nonPhoLen > 0 && categoryItem.nonPho[nonPhoLen - 1].time))
                categoryItem.nonPho.push(new TrackedNonPho(auth));
        }));
    }, [])

    const submitPho = (bag: number, newPho: Pho) => {
        if (bag > bags.size) bag = bags.size - 1;
        const isEdit = bag < 0;
        const targetBag = bags.get(isEdit ? itemRef.bag : bag)!;
        const categoryItems = targetBag.get(props.category)!;

        if (isEdit) {
            categoryItems.pho[itemRef.trackedIndex].items.set(newPho.id, newPho);
        } else {
            categoryItems.lastPhos().set(newPho.id, newPho);
        }
        categoryItems?.action.push(`${new Date().toISOString()}:${auth.name}:${isEdit ? 'Edit' : 'Add'} pho'`);

        setPho(new Pho());
    }

    const showPho = (bag: number, category: string, trackIndex: number, selectedItemId: string) => {
        if (selectedItemId === null || selectedItemId.length === 0) {
            setPho(new Pho());
            return;
        }
        props.setCategory(category);
        setItemRef({ bag: bag, trackedIndex: trackIndex });
        setPho(bags.get(bag)!.get(category)!.pho[trackIndex].items.get(selectedItemId)!);
    }

    return (
        <Grid2 columns={10} container spacing={1} sx={{ display: 'flex', mb: 1 }}>
            <Grid2 size={{ xs: 10, sm: 10, md: 7 }}>
                {props.category === 'CHICKEN' && <Box sx={{ height: '116.8px' }} />}
                {category?.pho && (
                    <TakePho
                        category={props.category}
                        bagSize={bags.size}
                        pho={pho}
                        submitPho={submitPho}
                    />
                )}
                {category?.nonPho && (
                    <TakeNonPho
                        category={props.category}
                        bags={bags}
                        onSubmit={() => {
                            setRefresh(!refresh);
                        }}
                    />)}
            </Grid2>
            <Grid2 size={{ xs: 10, sm: 10, md: 'grow' }}>
                <BagDnd bags={bags} phoId={pho.id} showPho={showPho} />
            </Grid2>
        </Grid2 >
    );

    // return (<>
    //     <Dialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)}>
    //         <DialogTitle>Confirm Order</DialogTitle>
    //         <DialogContent>
    //             <Typography>
    //                 Are you sure you want to place the order for Table {table.id}?
    //             </Typography>
    //         </DialogContent>
    //         <DialogActions>
    //             <Button onClick={() => setOpenConfirmDialog(false)}>Cancel</Button>
    //             <Button onClick={confirmOrder} variant="contained" color="primary">
    //                 Confirm
    //             </Button>
    //         </DialogActions>
    //     </Dialog>
    // </>
    // );
};

export default OrderTake;