import React, { useState } from 'react';
import { COMPONENT } from '../my/my-component';
import TakeNonPho from '../waiter/TakeNonPho';
import { Order } from '../my/my-class';
import { Box, Grid2, useMediaQuery } from '@mui/material';
import { MENU } from '../my/my-constants';
import { MdOutlineBrowserUpdated } from 'react-icons/md';
import { StyledPaper } from '../my/my-styled';

interface NonPho {
    displayName: string;
    code?: string;
    price?: number;
    printers?: string[];
}

export default function MenuSetting(props: { close: () => void }) {
    const [selectedCategory, setCategory] = useState('BEEF');
    const [displayName, setDisplayName] = useState<string>('');
    const [selectedItem, setItem] = useState<NonPho>({} as NonPho);

    const mdSize = useMediaQuery('(min-width:900px)');

    const NON_PHOS = MENU[selectedCategory as keyof typeof MENU]!.nonPho;

    const onClickNonPho = (index: number, nonPhoCode: string) => {
        const nonPhoGroupObj = NON_PHOS[index];
        const nonPhoObj = nonPhoGroupObj[nonPhoCode as keyof typeof nonPhoGroupObj] as Object;
        setItem({ ...nonPhoObj, displayName: nonPhoCode } as NonPho);
    }

    const doneThenSync = () => { }

    return (<>
        <COMPONENT.Header back={props.close} actions={<Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            {Object.keys(MENU).map((category) => (
                <COMPONENT.WrapCategoryButton key={category} props={{
                    selectedCategory: selectedCategory, category: category, setCategory: setCategory,
                    size: mdSize ? 'xlarge' : 'xlarge',
                }} />
            ))}

            <Box sx={{ ml: 5 }}>
                <COMPONENT.WrapCategoryButton props={{
                    selectedCategory: selectedCategory, category: 'Done & Sync', setCategory: doneThenSync,
                    size: mdSize ? 'xlarge' : 'xlarge', icon: <MdOutlineBrowserUpdated style={{ fontSize: 25, marginLeft: 2 }} />,
                }} />
            </Box>
        </Box>} />
        <Grid2 columns={10} container spacing={1} sx={{ display: 'flex', mb: 1 }}>
            <Grid2 size={{ xs: 10, sm: 10, md: 7 }}>
                <TakeNonPho category={selectedCategory} bags={new Map([[0, new Order('').newBag()]])} onSubmit={onClickNonPho} viewPrice={true} />
            </Grid2>
            <Grid2 size={{ xs: 10, sm: 10, md: 'grow' }}>
                <StyledPaper sx={{ mt: 1}}>
                    Default printer:'xxx'
                    {selectedItem.displayName}
                    {selectedItem.code}
                    {selectedItem.price}
                    {selectedItem.printers}
                </StyledPaper>
            </Grid2>
        </Grid2 >
    </>);
}