import React, { useEffect, useState, useRef } from 'react';
import { CheckButton, COMPONENT } from '../my/my-component';
import { Box, Button, Divider, Grid2, TextField, Typography, useMediaQuery } from '@mui/material';
import { MENU, PRINTER } from '../my/my-constants';
import { MdOutlineBrowserUpdated } from 'react-icons/md';
import { CategoryButton, StyledPaper } from '../my/my-styled';
import _ from 'lodash';
import { FaEye, FaPlus, FaTrash } from "react-icons/fa";
import { IoMdBarcode } from "react-icons/io";
import { NonPhoConfig } from '../my/my-class';

interface NonPho extends NonPhoConfig {
    groupIndex: number;
}

export default function MenuSetting(props: { close: () => void }) {
    const [selectedCategory, setCategory] = useState('BEEF');
    const [selectedItem, setSelectedItem] = useState<NonPho>({} as NonPho);

    const menuClone = useRef(_.cloneDeep(MENU));
    // const [printers, setPrinters] = useState<string[]>(MENU[selectedCategory as keyof typeof MENU].printers);

    const mdSize = useMediaQuery('(min-width:900px)');

    const NON_PHOS = menuClone.current[selectedCategory as keyof typeof MENU]!.nonPho;

    // useEffect(() => {
    //     setPrinters(MENU[selectedCategory as keyof typeof MENU].printers);
    // }, [selectedCategory]);

    const onClickNonPho = (groupIndex: number, displayName: string) => {
        const nonPhoGroupObj = NON_PHOS[groupIndex];
        const nonPhoObj = nonPhoGroupObj[displayName as keyof typeof nonPhoGroupObj] as Object;
        setSelectedItem({ ...nonPhoObj, groupIndex, displayName } as NonPho);
    }

    const setItem = (item: NonPho) => {
        let nonPhoGroupObj = NON_PHOS[item.groupIndex];
        if (selectedItem.displayName !== item.displayName)
            delete nonPhoGroupObj[selectedItem.displayName as keyof typeof nonPhoGroupObj];
        NON_PHOS[item.groupIndex] = { ...NON_PHOS[item.groupIndex], [item.displayName]: item };
        setSelectedItem(item);
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
                    selectedCategory: 'Done & Sync', category: 'Done & Sync', setCategory: doneThenSync,
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
                <Button sx={{ minHeight: 50, m: 1 }} onClick={() => { }} variant="contained" color="primary" size='small'>
                    Add new group
                    <IoMdBarcode style={{ fontSize: 30, marginLeft: 8 }} />
                </Button>
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
                     */}
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
                    <Box sx={{ mt: 1, display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                        <CategoryButton sx={{ minHeight: 50 }} onClick={() => { }} selected={selectedItem.displayName?.length > 0 && selectedItem.disabled} disabled={(selectedItem.displayName || '').length === 0} variant="outlined" color="primary" size='small'>
                            Disabled
                            <FaEye style={{ fontSize: 30, marginLeft: 8 }} />
                        </CategoryButton>
                        <CategoryButton sx={{ minHeight: 50 }} onClick={() => { }} selected={true} disabled={(selectedItem.displayName || '').length === 0} variant="contained" color="primary" size='small'>
                            Delete
                            <FaTrash style={{ fontSize: 30, marginLeft: 8 }} />
                        </CategoryButton>
                    </Box>
                    <Divider sx={{ mt: 2, mb: 1 }} />
                    <Button sx={{ minHeight: 50 }} onClick={() => { }} disabled={(selectedItem.displayName || '').length === 0} variant="contained" color="primary" size='small'>
                        Add new item to this group
                        <FaPlus style={{ fontSize: 30, marginLeft: 8 }} />
                    </Button>
                </StyledPaper>
            </Grid2>
        </Grid2 >
    </>);
}