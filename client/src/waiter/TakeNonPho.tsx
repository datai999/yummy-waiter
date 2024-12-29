import React, {
    useState,
} from 'react';
import { CategoryItem, NonPho, Pho } from '../my/my-class';
import { CheckButton } from '../my/my-component';
import { CATEGORY } from '../my/my-constants';
import { StyledPaper } from '../my/my-styled';

interface TakeNonPhoProps {
    category: string,
    bags: Map<number, Map<string, CategoryItem>>,
    onSubmit: () => void
}

const TakeNonPho = (props: TakeNonPhoProps) => {
    const [nonPho, setNonPho] = useState<Map<string, NonPho>>(new Map());

    const nonPhos = CATEGORY[props.category as keyof typeof CATEGORY]!.nonPho;

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