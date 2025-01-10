import React, {
    useEffect,
    useState,
} from 'react';
import { CategoryItem, NonPho, Pho } from '../my/my-class';
import { CheckButton } from '../my/my-component';
import { MENU } from '../my/my-constants';
import { StyledPaper } from '../my/my-styled';
import { Box, Divider } from '@mui/material';

interface TakeNonPhoProps {
    category: string,
    bags: Map<number, Map<string, CategoryItem>>,
    onSubmit: () => void
}

const TakeNonPho = (props: TakeNonPhoProps) => {
    const nonPhos = MENU[props.category as keyof typeof MENU]!.nonPho;
    const nonPho = props.bags.get(0)!.get(props.category)?.lastNonPhos()!;

    const addItem = (nonPhoCode: string) => {
        let targetNonPho = Array.from(nonPho.values())
            .find(value => value.code === nonPhoCode && (!value.note || value.note.trim().length === 0));

        if (targetNonPho) {
            targetNonPho.qty++;
            targetNonPho.actualQty++;
        } else targetNonPho = new NonPho(nonPhoCode);

        const dineIn = props.bags.get(0)!;
        const categoryItems = dineIn.get(props.category)!;
        categoryItems.lastNonPhos().set(targetNonPho.id, targetNonPho);
        categoryItems.action.push(new Date().toISOString() + ':add nonPho');

        props.onSubmit();
    }

    return (<StyledPaper sx={{ mt: 1, mb: 0, p: 0, pl: 1, minHeight: '228px' }}>
        {nonPhos.map((nonPho, index) => (
            <Box key={index}>
                {index > 0 && (<Divider sx={{ m: ['BEEF', 'CHICKEN'].includes(props.category) ? 0.2 : 1 }} />)}
                <CheckButton
                    multi={true}
                    allOptions={Object.keys(nonPho)}
                    options={[]}
                    createLabel={(key) => key}
                    callback={(newSideOrder) => addItem(newSideOrder[0])}
                />
            </Box>
        ))}
    </StyledPaper >);
}

export default TakeNonPho;