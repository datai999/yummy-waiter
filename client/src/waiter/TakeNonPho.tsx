import React, {
    useContext,
    useEffect,
    useState,
} from 'react';
import { CategoryItem, NonPho, Pho } from '../my/my-class';
import { CheckButton } from '../my/my-component';
import { StyledPaper } from '../my/my-styled';
import { Box, Divider } from '@mui/material';
import { APP_CONTEXT } from '../App';
import { UTILS } from '../my/my-util';

interface TakeNonPhoProps {
    category: string,
    bags: Map<number, Map<string, CategoryItem>>,
    onSubmit: (index: number, nonPhoCode: string) => void,
}

const TakeNonPho = (props: TakeNonPhoProps) => {
    const { MENU, auth, isLockedOrder } = useContext(APP_CONTEXT);

    const NON_PHOS: Object[] = MENU[props.category as keyof typeof MENU]!.nonPho;
    const nonPho = props.bags.get(0)!.get(props.category)?.lastNonPhos()!;

    const addItem = (index: number, nonPhoCode: string) => {
        if (isLockedOrder) return;

        let targetNonPho = Array.from(nonPho.values())
            .find(value => value.code === nonPhoCode && (!value.note || value.note.trim().length === 0));

        if (targetNonPho) {
            targetNonPho.qty++;
            targetNonPho.actualQty++;
        } else {
            const nonPhoGroupObj = NON_PHOS[index];
            const nonPhoObj: Object = nonPhoGroupObj[nonPhoCode as keyof typeof nonPhoGroupObj];
            let price: number = 0;
            if (nonPhoObj) {
                price = Number(nonPhoObj['price' as keyof typeof nonPhoObj]);
            }
            targetNonPho = new NonPho(nonPhoCode, price || 0);
        }

        const dineIn = props.bags.get(0)!;
        const categoryItems = dineIn.get(props.category)!;
        categoryItems.lastNonPhos().set(targetNonPho.id, targetNonPho);
        categoryItems.action.push(`${UTILS.formatTime()}:${auth.name}:${nonPhoCode}`);

        props.onSubmit(index, nonPhoCode);
    }

    return (<StyledPaper sx={{ mt: 1, mb: 0, p: 0, pl: 1, minHeight: '228px' }}>
        {NON_PHOS.map((nonPho, index) => (
            <Box key={index}>
                {index > 0 && (<Divider sx={{ m: ['BEEF', 'CHICKEN'].includes(props.category) ? 0.2 : 1 }} />)}
                <CheckButton
                    multi={true}
                    obj={nonPho}
                    options={[]}
                    callback={(newSideOrder) => addItem(index, newSideOrder[0])}
                />
            </Box>
        ))}
    </StyledPaper >);
}

export default TakeNonPho;