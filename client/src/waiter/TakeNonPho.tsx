import React, {
    useEffect,
    useState,
} from 'react';
import { CategoryItem, NonPho, Pho } from '../my/my-class';
import { CheckButton } from '../my/my-component';
import { MENU } from '../my/my-constants';
import { StyledPaper } from '../my/my-styled';

interface TakeNonPhoProps {
    category: string,
    bags: Map<number, Map<string, CategoryItem>>,
    onSubmit: () => void
}

const getNonPho = (props: TakeNonPhoProps) => props.bags.get(0)!.get(props.category)?.nonPho!;

const TakeNonPho = (props: TakeNonPhoProps) => {
    const [nonPho, setNonPho] = useState<Map<string, NonPho>>(getNonPho(props));

    const nonPhos = MENU[props.category as keyof typeof MENU]!.nonPho;

    useEffect(() => {
        setNonPho(getNonPho(props));
    }, [props.category])

    const addItem = (nonPhoKey: string) => {
        const nextNonPho = new Map(nonPho);
        if (nextNonPho.has(nonPhoKey)) {
            nextNonPho.get(nonPhoKey)!.count++;
        } else {
            nextNonPho.set(nonPhoKey, new NonPho(nonPhoKey));
        }
        setNonPho(nextNonPho);

        const cloneBags = new Map(props.bags);
        const dineIn = cloneBags.get(0)!;
        const categoryItems = dineIn.get(props.category)!;

        categoryItems.nonPho = nextNonPho;
        categoryItems.action.push(new Date().toISOString() + ':add nonPho');

        props.onSubmit();
    }

    return (<StyledPaper>
        {nonPhos.map((nonPho, index) => (
            <CheckButton
                key={index}
                multi={true}
                allOptions={Object.keys(nonPho)}
                options={[]}
                createLabel={(key) => key}
                callback={(newSideOrder) => addItem(newSideOrder[0])}
            />
        ))}
    </StyledPaper >);
}

export default TakeNonPho;