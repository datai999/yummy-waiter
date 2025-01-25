import React, { useEffect, useState } from 'react';
import { CheckButton, COMPONENT } from '../my/my-component';
import { Order } from '../my/my-class';
import { Box, Divider, Grid2, TextField, Typography, useMediaQuery } from '@mui/material';
import { MENU, PRINTER } from '../my/my-constants';
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
    const [selectedItem, setItem] = useState<NonPho>({} as NonPho);
    // const [printers, setPrinters] = useState<string[]>(MENU[selectedCategory as keyof typeof MENU].printers);

    const mdSize = useMediaQuery('(min-width:900px)');

    const NON_PHOS = MENU[selectedCategory as keyof typeof MENU]!.nonPho;

    // useEffect(() => {
    //     setPrinters(MENU[selectedCategory as keyof typeof MENU].printers);
    // }, [selectedCategory]);

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
                <StyledPaper sx={{ mt: 1, mb: 0, p: 0, pl: 1, minHeight: '228px' }}>
                    {NON_PHOS.map((nonPho, index) => (
                        <Box key={index}>
                            {index > 0 && (<Divider sx={{ m: ['BEEF', 'CHICKEN'].includes(selectedCategory) ? 0.2 : 1 }} />)}
                            <CheckButton
                                multi={false}
                                obj={nonPho}
                                options={[selectedItem.displayName]}
                                callback={(newSideOrder) => onClickNonPho(index, newSideOrder[0])}
                                setting={true}
                            />
                        </Box>
                    ))}
                </StyledPaper>
            </Grid2>
            <Grid2 size={{ xs: 10, sm: 10, md: 'grow' }}>
                <StyledPaper sx={{ mt: 1 }}>
                    {/* Printer:
                    <CheckButton
                        multi={true}
                        obj={PRINTER}
                        options={printers}
                        callback={(next) => setPrinters(next)}
                    />
                    <Divider sx={{ mt: 1 }} /> */}
                    <Box sx={{ display: 'flex', flexDirection: 'row', ml: 2 }}>
                        <Box sx={{ width: '110px', alignContent: 'center', fontWeight: 600 }}>
                            Display name:
                        </Box>
                        <TextField
                            fullWidth
                            size='small'
                            sx={{ m: 1, ml: 0, maxWidth: '130px' }}
                            value={selectedItem.displayName || ''}
                            onChange={(e) => setItem({ ...selectedItem, displayName: e.target.value })}
                        />
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'row', ml: 2 }}>
                        <Box sx={{ width: '110px', alignContent: 'center', fontWeight: 600 }}>
                            Kitchen code:
                        </Box>
                        <TextField
                            fullWidth
                            size='small'
                            sx={{ m: 1, ml: 0, maxWidth: '130px' }}
                            value={selectedItem.code || ''}
                            onChange={(e) => setItem({ ...selectedItem, code: e.target.value })}
                        />
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'row', ml: 2 }}>
                        <Box sx={{ width: '110px', alignContent: 'center', fontWeight: 600 }}>
                            Price:
                        </Box>
                        <TextField margin="none" size='small'
                            type='number'
                            inputProps={{ inputMode: 'numeric', style: {}, }}
                            InputProps={{
                                type: "number",
                                sx: {
                                    '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                                        display: 'none'
                                    },
                                    '& input[type=number]': {
                                        MozAppearance: 'textfield'
                                    },
                                }
                            }}
                            fullWidth={true}
                            sx={{
                                m: 1, ml: 0, maxWidth: '130px',
                                input: {
                                    color: 'primary',
                                    "&::placeholder": {
                                        opacity: 1,
                                    },
                                },
                            }}
                            // placeholder={props.placeholder}
                            value={selectedItem.price || ''}
                            onChange={(e) => {
                                const num = Number(e.target.value);
                                setItem({ ...selectedItem, price: num })
                            }}
                        />
                    </Box>
                </StyledPaper>
            </Grid2>
        </Grid2 >
    </>);
}