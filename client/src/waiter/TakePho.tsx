import React, {
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';
import { StyledPaper } from '../my/my-styled';
import { Divider, Grid2, TextField, Button } from '@mui/material';
import { CheckButton, NumberInput } from '../my/my-component';
import { MENU } from '../my/my-constants';
import { Pho } from '../my/my-class';
import * as SERVICE from '../my/my-service';
import { GiPaperBagFolded } from 'react-icons/gi';
import { MdTableRestaurant } from 'react-icons/md';
import { TableContext } from '../App';

interface TakePhoProps {
    category: string,
    bagSize: number,
    pho: Pho,
    submitPho: (bag: number, pho: Pho) => void
}

const arePropsEqual = (prev: TakePhoProps, next: TakePhoProps) => {
    return prev.category === next.category
        && prev.pho.id === next.pho.id
        && prev.bagSize === next.bagSize;
}

const pTakePho = (props: TakePhoProps) => {
    const { table } = useContext(TableContext);
    const [refresh, setRefresh] = useState(false);
    const [pho, setPho] = useState<Pho>({ ...props.pho });
    const [note, setNote] = useState(props.pho.note);
    const disabled = useRef<{ noodles: string[], prefers: string[] }>({ noodles: ['BS', 'BTS'], prefers: [] }).current;

    const category = MENU[props.category as keyof typeof MENU]!;
    const combos = category.pho!.combo;
    const meats = category.pho!.meat;
    const noodles = category.pho!.noodle;
    const references = category.pho!.reference;

    useEffect(() => {
        onNoodleChange([props.pho.noodle]);
        onPreferChange(props.pho.preferences || []);
        setPho({ ...props.pho } as Pho);
        setNote(props.pho.note);
    }, [props.pho.id, props.category])

    useEffect(() => {
        if (!meats) return;
        // if (pho.meats.length > 1 && pho.meats.includes('BPN'))
        //     pho.meats = pho.meats.filter(meat => meat !== "BPN");
        pho.meats.sort(SERVICE.sortBeefMeat);
        const meatCodes = pho.meats.join(',');
        const combo = Object.entries(combos)
            .find(([key, value]) => {
                if (value.length !== pho.meats.length) return false;
                return value.sort(SERVICE.sortBeefMeat).join(',') === meatCodes;
            }) || [undefined, undefined];
        let change = false;
        const nextPho = { ...pho };
        if (combo[0] !== pho.combo) {
            change = true;
            nextPho.combo = combo[0];
        }
        if (!pho.meats.includes('Tái')) {
            const nextPrefer = (pho.preferences || [])
                .filter(p => !['Tái riêng', 'Tái băm'].includes(p));
            if (nextPrefer.length !== pho.preferences?.length) {
                change = true;
                nextPho.preferences = nextPrefer;
            }
        }
        if (change) {
            setPho(nextPho);
        }
    }, [pho.meats]);

    useEffect(() => {
        if (props.bagSize > 1 || table.id.startsWith('Togo'))
            if (disabled.noodles.length === 2) {
                disabled.noodles = [];
                setRefresh(!refresh);
            }
    }, [table.id, props.bagSize]);

    const addItem = (bag: number) => {
        if (!MENU[props.category as keyof typeof MENU].pho?.noodle.includes(pho.noodle)) {
            alert('Please select a noodle!');
            return;
        }
        pho.note = note;
        SERVICE.completePho(category, pho);
        props.submitPho(bag, pho);
        setPho(new Pho());
        setNote('');
    }

    const onNoodleChange = (noodles: string[]) => {
        if (noodles.length !== 1) return;
        const noodle = noodles[0];

        let prefers = new Set(pho.preferences || []);
        if (['BC', 'BT'].includes(noodle)) {
            disabled.prefers = ['Măng'];
        } else if (['BS', 'BTS'].includes(noodle)) {
            disabled.prefers = ['Khô', 'Măng'];
        } else if (['Bún'].includes(noodle)) {
            disabled.prefers = ['Khô'];
            prefers.add('Măng');
        } else if (['Miến', 'Mì'].includes(noodle)) {
            disabled.prefers = [];
            prefers.add('Măng');
            if (noodle === 'Mì') prefers.add('Khô');
        }
        disabled.prefers.forEach(dp => prefers.delete(dp));

        setPho({ ...pho, noodle: noodle, preferences: Array.from(prefers) })
    }

    const onPreferChange = (prefers: string[]) => {
        if (pho.noodle === 'Mì' && !prefers.includes('Khô')) return;
        if (prefers.includes('Tái riêng') || prefers.includes('Tái băm')) {
            if (!pho.meats.includes('Tái')) pho.meats = ['Tái', ...pho.meats];
        }
        setPho({ ...pho, preferences: prefers })
    }

    return (
        <StyledPaper key={props.category} sx={{ mb: 1, p: 1, pl: 1, pr: 0 }}>
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
                <Divider textAlign="left" sx={{ m: 0.5 }}></Divider>
                <CheckButton
                    multi={true}
                    allOptions={Object.keys(meats)}
                    options={pho.meats}
                    createLabel={(key) => key}
                    callback={(meats) => setPho({ ...pho, meats })}
                />
            </>)}

            <Divider textAlign="left" sx={{ m: 0.5 }}></Divider>
            <CheckButton
                multi={false}
                allOptions={noodles}
                disabled={disabled.noodles}
                options={[pho.noodle]}
                createLabel={(key) => key}
                callback={onNoodleChange}
            />

            <Divider textAlign="left" sx={{ m: 0.5 }}></Divider>
            <CheckButton
                multi={true}
                allOptions={Object.keys(references)}
                disabled={disabled.prefers}
                options={pho.preferences || []}
                createLabel={(key) => key}
                callback={onPreferChange}
            />

            <Grid2 container spacing={2} alignItems="center" sx={{ mt: 1, ml: 1, mr: 1 }}>
                <Grid2 size={{ xs: 3, sm: 1, md: 1 }}>
                    <NumberInput value={pho.qty} onChange={num => { setPho({ ...pho, qty: num }); }} label='Qty' />
                </Grid2>
                <Grid2 size={{ xs: 9, sm: 6, md: 5 }}  >
                    <TextField
                        fullWidth
                        label="Special Notes"
                        size='small'
                        value={note}
                        onChange={(e) => {
                            setNote(e.target.value);
                        }}
                    />
                </Grid2>
                <Grid2 size={{ xs: 'auto', sm: 3, md: 3 }}  >
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => addItem(pho.id.length > 0 ? -1 : 0)}
                        fullWidth
                        size='large'
                    >
                        {`${pho.id.length > 0 ? 'Edit item' : table.id.startsWith('Togo') ? 'Togo 1' : 'Dine-in'}`}
                        {table.id.startsWith('Togo')
                            ? <GiPaperBagFolded style={{ fontSize: 30, marginLeft: 8 }} />
                            : <MdTableRestaurant style={{ fontSize: 30, marginLeft: 8 }} />}
                    </Button>
                </Grid2>
                <Grid2 size={{ xs: 'auto', sm: 2, md: 3 }}  >
                    {props.bagSize > 1 && pho.id.length === 0 && (<Button
                        variant="contained"
                        color="primary"
                        onClick={() => addItem(999)}
                        fullWidth
                        size='large'
                    >
                        {table.id.startsWith('Togo') || props.bagSize > 2
                            ? `Togo ${table.id.startsWith('Togo') ? props.bagSize : props.bagSize - 1}`
                            : 'Togo'}
                        <GiPaperBagFolded style={{ fontSize: 30, marginLeft: 8 }} />
                    </Button>)}
                </Grid2>
            </Grid2>
        </StyledPaper>
    )
}

const TakePho = React.memo(pTakePho, arePropsEqual);
export default TakePho;