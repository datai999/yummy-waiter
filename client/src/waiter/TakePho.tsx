import React, {
    useEffect,
    useState,
} from 'react';
import { StyledPaper } from '../my/my-styled';
import { Divider, Grid2, TextField, Button } from '@mui/material';
import { CheckButton } from '../my/my-component';
import { CATEGORY } from '../my/my-constants';
import { CategoryItem, Pho } from '../my/my-class';
import * as SERVICE from '../my/my-service';

interface TakePhoProps {
    category: string,
    bags: Map<number, Map<string, CategoryItem>>,
    currentBag: number,
    pho: Pho,
    onSubmit: (pho: Pho) => void
}

const arePropsEqual = (prev: TakePhoProps, next: TakePhoProps) => {
    return prev.category === next.category
        && prev.pho.id === next.pho.id;
}

const pTakePho = (props: TakePhoProps) => {
    const [pho, setPho] = useState<Pho>({ ...props.pho });

    const category = CATEGORY[props.category as keyof typeof CATEGORY]!;
    const combos = category.pho!.combo;
    const meats = category.pho!.meat;
    const noodles = category.pho!.noodle;
    const references = category.pho!.reference;

    useEffect(() => {
        setPho({ ...props.pho } as Pho);
    }, [props.pho.id, props.category])

    useEffect(() => {
        if (!meats) return;
        if (pho.meats.length > 1 && pho.meats.includes('BPN'))
            pho.meats = pho.meats.filter(meat => meat !== "BPN");
        pho.meats.sort(SERVICE.sortBeefMeat);
        const meatCodes = pho.meats.join(',');
        const combo = Object.entries(combos)
            .find(([key, value]) => {
                if (value.length !== pho.meats.length) return false;
                return value.sort(SERVICE.sortBeefMeat).join(',') === meatCodes;
            });
        if (!combo) {
            setPho({ ...pho, combo: undefined });
        }
        if (combo && combo[0] !== pho.combo) {
            setPho({ ...pho, combo: combo[0] });
        }
    }, [pho.meats]);

    const addItem = (bag: number) => {
        const cloneBags = new Map(props.bags);
        const dineIn = cloneBags.get(pho.id?.length > 0 ? props.currentBag : bag)!;
        const categoryItems = dineIn.get(props.category);

        SERVICE.completePho(pho);

        categoryItems?.pho.set(pho.id, pho);
        categoryItems?.action.push(new Date().toISOString() + ':add pho');

        props.onSubmit(pho);
        setPho(new Pho());
    }

    return (
        <StyledPaper key={props.category} sx={{ mb: 1, pb: 1 }}>
            <CheckButton
                multi={false}
                allOptions={Object.keys(combos)}
                options={[pho.combo as string]}
                createLabel={(key) => key}
                callback={(combo) => setPho({
                    ...pho,
                    combo: combo.length === 0 ? '' : combo[0],
                    meats: combo.length === 0 ? [] : combos[combo[0] as keyof typeof combos]
                })}
            />

            {meats && (<>
                <Divider textAlign="left" sx={{ mb: 1 }}></Divider>
                <CheckButton
                    multi={true}
                    allOptions={Object.keys(meats)}
                    options={pho.meats}
                    createLabel={(key) => key}
                    callback={(meats) => setPho({ ...pho, meats })}
                />
            </>)}

            <Divider textAlign="left" sx={{ mb: 1 }}></Divider>
            <CheckButton
                multi={false}
                allOptions={noodles}
                options={[pho.noodle]}
                createLabel={(key) => key}
                callback={(noodles) => setPho({ ...pho, noodle: noodles[0] })}
            />

            <Divider textAlign="left" sx={{ mb: 1 }}></Divider>
            <CheckButton
                multi={true}
                allOptions={Object.keys(references)}
                options={pho.preferences || []}
                createLabel={(key) => key}
                callback={(preferences) => setPho({
                    ...pho, preferences
                })}
            />

            <Grid2 container spacing={2} alignItems="center">
                <Grid2 size={{ xs: 5, sm: 6, md: 5 }}  >
                    <TextField
                        fullWidth
                        label="Special Notes"
                        size='small'
                        value={pho.note}
                        onChange={(e) => setPho({ ...pho, note: e.target.value })}
                    />
                </Grid2>
                <Grid2 size={{ xs: 'auto', sm: 2, md: 2 }}  >
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => addItem(0)}
                        fullWidth
                    >
                        {`${pho.id.length > 0 ? 'Edit item' : 'Dine-in'}`}
                    </Button>
                </Grid2>
                <Grid2 size={{ xs: 'auto', sm: 2, md: 2 }}  >
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => addItem(1)}
                        fullWidth
                    >
                        {`Togo`}
                    </Button>
                </Grid2>
            </Grid2>
        </StyledPaper>
    )
}

const TakePho = React.memo(pTakePho, arePropsEqual);
export default TakePho;