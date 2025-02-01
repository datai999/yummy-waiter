import React, {
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';
import { StyledPaper } from '../my/my-styled';
import { Divider, Grid2, TextField, Button } from '@mui/material';
import { CheckButton, COMPONENT } from '../my/my-component';
import { Pho } from '../my/my-class';
import * as SERVICE from '../my/my-service';
import { GiPaperBagFolded } from 'react-icons/gi';
import { MdTableRestaurant } from 'react-icons/md';
import { APP_CONTEXT } from '../App';

interface TakePhoProps {
    isDoneItem: boolean,
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
    const { MENU, order, isLockedOrder } = useContext(APP_CONTEXT);
    const [refresh, setRefresh] = useState(false);
    const [pho, setPho] = useState<Pho>({ ...props.pho });
    const [note, setNote] = useState<String>(props.pho.note || '');

    const category = MENU[props.category as keyof typeof MENU]!;
    const COMBOS = category.pho!.combo;
    const meats = category.pho!.meat;
    const noodles = category.pho!.noodle;
    const references = category.pho!.reference;

    useEffect(() => {
        setPho({ ...props.pho } as Pho);
        setNote(props.pho.note || '');
    }, [props.pho.id, props.category])

    const addItem = (bag: number) => {
        const nonNoodle = pho.combo?.startsWith('#8b') || pho.combo?.startsWith('#8c');
        if (!noodles.includes(pho.noodle) && !nonNoodle) {
            alert('Please select a noodle!');
            return;
        }
        pho.note = note;
        SERVICE.completePho(category, pho);
        props.submitPho(bag, pho);
        setPho(new Pho());
        setNote('');
    }

    const calDisabledNoodles = (pho: Pho): string[] => {
        const disabledNoodles = [
            ...(pho.combo?.startsWith('#8b') || pho.combo?.startsWith('#8c') ? ['BC', 'BT', 'BS', 'BTS'] : []),
            ...(props.bagSize < 2 && !order.id.startsWith('Togo') ? ['BS', 'BTS'] : [])
        ];
        return disabledNoodles;
    }

    const calDisabledPrefers = (pho: Pho): string[] => {
        const disabledPrefers = [
            ...(pho.meats.includes('Xi') || pho.combo?.startsWith('#8') ? ['Tái riêng', 'Tái băm', 'Tái cook'] : []),
            pho.combo?.startsWith('#8b') ? 'Ít bánh' : '',
            pho.combo?.startsWith('C') ? 'Không xương' : '',
            ['BC', 'BT', 'BS', 'BTS'].includes(pho.noodle) ? 'Măng' : '',
            ['BS', 'BTS', 'Bún'].includes(pho.noodle) ? 'Khô' : ''
        ];
        pho.preferences = pho.preferences?.filter(prefer => !disabledPrefers.includes(prefer));
        return disabledPrefers;
    }

    const onComboChange = (nextCombos: string[]) => {
        if (nextCombos.length === 0) return;
        const combo = nextCombos[0];
        if (combo.startsWith('#8b')) {
            pho.noodle = 'Bread'
        } else if (combo.startsWith('#8c')) {
            pho.noodle = 'Mì'
        }
        if (pho.combo
            && (pho.combo.startsWith('#8b') || pho.combo.startsWith('#8c'))
            && !(combo.startsWith('#8b') || combo.startsWith('#8c'))
        ) {
            pho.noodle = 'BC'
        }
        const comboMeats: string[] = COMBOS[combo as keyof typeof COMBOS].toString().split(',');
        setPho({
            ...pho,
            combo: combo,
            meats: comboMeats
        })
    }

    const onMeatChange = (nextMeats: string[]) => {
        if (!meats) return;
        // if (pho.meats.length > 1 && pho.meats.includes('BPN'))
        //     pho.meats = pho.meats.filter(meat => meat !== "BPN");
        nextMeats.sort(SERVICE.sortBeefMeat);
        const meatCodes = nextMeats.join(',');
        const combo = Object.entries(COMBOS)
            .find(([key, value]) => {
                if (value.length !== nextMeats.length) return false;
                return value.sort(SERVICE.sortBeefMeat).join(',') === meatCodes;
            }) || [undefined, undefined];
        if (combo[0] !== pho.combo) {
            pho.combo = combo[0];
        }
        if (!nextMeats.includes('Tái')) {
            const nextPrefer = (pho.preferences || [])
                .filter(p => !['Tái riêng', 'Tái băm', 'Tái cook'].includes(p));
            if (nextPrefer.length !== pho.preferences?.length) {
                pho.preferences = nextPrefer;
            }
        }
        setPho({ ...pho, meats: nextMeats });
    }

    const onNoodleChange = (noodles: string[]) => {
        if (noodles.length !== 1) return;
        const noodle = noodles[0];
        if (['Bún', 'Miến', 'Mì'].includes(noodle)) {
            const prefers = new Set(pho.preferences || []);
            prefers.add('Măng');
            if (noodle === 'Mì') prefers.add('Khô');
            pho.preferences = Array.from(prefers);
        }
        setPho({ ...pho, noodle: noodle });
    }

    const onPreferChange = (prefers: string[]) => {
        if (pho.noodle === 'Mì' && !prefers.includes('Khô')) return;
        if (prefers.includes('Tái riêng') || prefers.includes('Tái băm') || prefers.includes('Tái cook')) {
            if (!pho.meats.includes('Tái')) {
                pho.preferences = prefers;
                onMeatChange(['Tái', ...pho.meats]);
                return;
            }
        }
        setPho({ ...pho, preferences: prefers })
    }

    return (
        <StyledPaper key={props.category} sx={{ mb: 1, p: 1, pl: 1, pr: 0 }}>
            <CheckButton
                multi={false}
                obj={COMBOS}
                options={[pho.combo as string]}
                createLabel={(key) => key}
                callback={onComboChange}
            />

            {meats && (<>
                <Divider textAlign="left" sx={{ m: 0.5 }}></Divider>
                <CheckButton
                    multi={true}
                    obj={meats}
                    options={pho.meats}
                    createLabel={(key) => key}
                    callback={onMeatChange}
                />
            </>)}

            <Divider textAlign="left" sx={{ m: 0.5 }}></Divider>
            <CheckButton
                multi={false}
                obj={noodles.reduce((a, v) => ({ ...a, [v]: v }), {})}
                disabled={calDisabledNoodles(pho)}
                options={[pho.noodle]}
                createLabel={(key) => key}
                callback={onNoodleChange}
            />

            <Divider textAlign="left" sx={{ m: 0.5 }}></Divider>
            <CheckButton
                multi={true}
                obj={references}
                disabled={calDisabledPrefers(pho)}
                options={pho.preferences || []}
                createLabel={(key) => key}
                callback={onPreferChange}
            />

            <Grid2 container spacing={2} alignItems="center" sx={{ mt: 1, ml: 1, mr: 1 }}>
                <Grid2 size={{ xs: 3, sm: 1, md: 1 }} sx={{ mb: 0 }}>
                    <COMPONENT.NumberInput value={pho.qty} label='Qty' inputProps={{ fontSize: 16, fontWeight: 600 }}
                        onChange={num => {
                            const numSlice = Number(num.toString().slice(-1));
                            setPho({ ...pho, qty: numSlice, actualQty: numSlice });
                        }} />
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
                        size='large'
                        fullWidth
                        disabled={props.isDoneItem || !pho.isPho || isLockedOrder}
                        onClick={() => addItem(pho.id.length > 0 ? -1 : 0)}
                    >
                        {`${pho.id.length > 0 ? 'Edit item' : order.id.startsWith('Togo') ? 'Togo 1' : 'Dine-in'}`}
                        {order.id.startsWith('Togo')
                            ? <GiPaperBagFolded style={{ fontSize: 30, marginLeft: 8 }} />
                            : <MdTableRestaurant style={{ fontSize: 30, marginLeft: 8 }} />}
                    </Button>
                </Grid2>
                <Grid2 size={{ xs: 'auto', sm: 2, md: 3 }}  >
                    {props.bagSize > 1 && pho.id.length === 0 && (<Button
                        variant="contained"
                        color="primary"
                        disabled={isLockedOrder}
                        onClick={() => addItem(999)}
                        fullWidth
                        size='large'
                    >
                        {order.id.startsWith('Togo') || props.bagSize > 2
                            ? `Togo ${order.id.startsWith('Togo') ? props.bagSize : props.bagSize - 1}`
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