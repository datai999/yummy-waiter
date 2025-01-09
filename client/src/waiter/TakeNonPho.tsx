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

    const addItem = (nonPhoKey: string) => {
        const nextNonPho = new Map(nonPho);
        let targetNonPho = nextNonPho.get(nonPhoKey);
        if (targetNonPho) {
            targetNonPho.qty++;
        } else targetNonPho = new NonPho(nonPhoKey);

        nextNonPho.set(nonPhoKey, targetNonPho);

        const dineIn = props.bags.get(0)!;
        const categoryItems = dineIn.get(props.category)!;
        categoryItems.lastNonPhos().set(nonPhoKey, targetNonPho);
        categoryItems.action.push(new Date().toISOString() + ':add nonPho');

        props.onSubmit();
    }

    return (<StyledPaper sx={{ mt: 1, mb: 0, p: 0, pl: 1 }}>
        {nonPhos.map((nonPho, index) => (
            <Box key={index}>
                {index > 0 && (<Divider sx={{ m: 0.5 }} />)}
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