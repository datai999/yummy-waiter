import React, {
    useEffect,
    useState,
} from 'react';
import { StyledPaper } from '../my/my-styled';
import { Divider, Grid2, TextField, Button } from '@mui/material';
import { CheckButton } from '../my/my-component';
import { BEEF_MEAT, CATEGORY } from '../my/my-constants';
import { CategoryItem, Pho } from '../my/my-class';
import * as SERVICE from '../my/my-service';

const TakePho = (props: { category: string, bags: Map<number, Map<string, CategoryItem>>, onSubmit: () => void }) => {
    const [pho, setPho] = useState<Pho>(new Pho());

    const category = CATEGORY[props.category as keyof typeof CATEGORY]!;
    const combos = category.pho!.combo;
    const meats = category.pho!.meat;
    const noodles = category.pho!.noodle;
    const references = category.pho!.reference;

    useEffect(() => {
        console.log('meat');
        if (!meats) return;
        console.log('meat2');
        pho.meats.sort(SERVICE.sortBeefMeat);
        const meatCodes = pho.meats.join(',');
        console.log(meatCodes);
        const combo = Object.entries(combos)
            .find(([key, value]) => {
                if (value.length !== pho.meats.length) return false;
                return value.sort(SERVICE.sortBeefMeat).join(',') === meatCodes;
            });
        if (!combo) {
            setPho({ ...pho, combo: '' });
        }
        if (combo && combo[0] !== pho.combo) {
            setPho({ ...pho, combo: combo[0] });
        }
    }, [pho.meats]);

    const addItem = (bag: number) => {
        const cloneBags = new Map(props.bags);
        const dineIn = cloneBags.get(bag)!;

        const categoryItems = dineIn.get(props.category);
        SERVICE.completePho(pho);

        categoryItems?.pho.set(pho.id, pho);
        categoryItems?.action.push(new Date().toISOString() + ':add pho');

        setPho(new Pho());
        props.onSubmit();
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
                    allOptions={Object.keys(BEEF_MEAT)}
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

export default TakePho;