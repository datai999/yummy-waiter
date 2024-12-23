import React, { useState } from 'react';

import { NonPhoCode } from 'myTypes';
import {
    FaMinus,
    FaPlus,
} from 'react-icons/fa';

import {
    Button,
    Chip,
    Grid2,
    List,
    ListItemText,
    TextField,
} from '@mui/material';

import { generateId } from './my-service';
import {
    CategoryButton,
    OrderItem,
} from './my-styled';

interface CheckButtonProps {
    multi: boolean,
    allOptions: string[],
    options?: string[],
    createLabel: (option: string) => string,
    callback: ([]) => void,
}

export const CheckButton = ({ multi, allOptions, options = [], createLabel, callback }: CheckButtonProps) => {
    return (
        <>
            <Grid2 container spacing={1} sx={{ display: { xs: 'none', sm: 'flex', md: 'flex', lg: 'flex' }, mb: 1 }}>
                {allOptions.map((option) => (
                    <Grid2 key={option}>
                        <CategoryButton
                            variant='outlined'
                            size='large'
                            onClick={() => {
                                if (!multi) {
                                    if (options?.includes(option))
                                        callback([]);
                                    else callback([option]);
                                    return;
                                }
                                const newOptions = options.includes(option)
                                    ? options.filter((e) => e !== option)
                                    : [...options, option];
                                callback(newOptions);
                            }}
                            selected={options?.includes(option)}
                        >
                            {createLabel(option)}
                        </CategoryButton>
                    </Grid2>
                ))}
            </Grid2>
            <Grid2 container spacing={1} sx={{ display: { xs: 'flex', sm: 'none', md: 'none', lg: 'none' }, mb: 1 }}>
                {allOptions.map((option) => (
                    <Grid2 key={option}>
                        <Chip
                            label={createLabel(option)}
                            onClick={() => {
                                if (!multi) {
                                    callback([option]);
                                    return;
                                }
                                const newOptions = options.includes(option)
                                    ? options.filter((e) => e !== option)
                                    : [...options, option];
                                callback(newOptions);
                            }}
                            color={options?.includes(option) ? "primary" : "default"}
                        />
                    </Grid2>
                ))}
            </Grid2>
        </>
    );
}

export const SideItemList = ({ canEdit, sideItems, doubleCol = true }: {
    canEdit: boolean;
    sideItems: Map<String, NonPhoCode>,
    doubleCol?: boolean,
}) => {
    const [refresh, setRefresh] = useState<Boolean>(false);

    const copy = (itemId: String) => {
        const newItem = { ...sideItems.get(itemId), id: generateId() } as NonPhoCode;
        sideItems.set(newItem.id, newItem);
        setRefresh(!refresh);
    }

    const remove = (itemId: String) => {
        sideItems.delete(itemId);
        setRefresh(!refresh);
    };

    return (
        <List dense sx={{ width: '100%', p: 0 }}>
            <Grid2 container columnSpacing={2}>
                {Array.from(sideItems.entries()).map(([key, value], index) => {
                    return (
                        <Grid2 key={index} size={doubleCol ? 6 : 12}  >
                            <OrderItem key={key as string} sx={{ display: 'flex' }}
                                style={{
                                    backgroundColor: `${(doubleCol
                                        ? (index % 4 === 2 || index % 4 === 3)
                                        : (index % 2 === 1))
                                        ? '#f3f3f3' : null}`
                                }}>
                                <Button onClick={() => { if (canEdit) remove(key) }}
                                    sx={{ m: 0, p: 1.7, mr: 0, pr: 0, pl: 0 }}
                                    style={{ maxWidth: '40px', minWidth: '30px', maxHeight: '40px', minHeight: '30px' }}>
                                    <FaMinus style={{ fontSize: 12 }} />
                                </Button>
                                <ListItemText
                                    id={key as string}
                                    primaryTypographyProps={{ style: { fontWeight: "bold", fontSize: 16 } }}
                                    secondaryTypographyProps={{ style: { color: "#d32f2f" } }}
                                    sx={{ p: 0, m: 0 }}
                                    primary={
                                        <TextField id={key as string} margin="none" size='small'
                                            type='number'
                                            inputProps={{ inputMode: 'numeric', style: { paddingLeft: 0, fontSize: 16, fontWeight: 600 } }}
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
                                                p: 0, m: 0,
                                                input: {
                                                    color: 'primary',
                                                    "&::placeholder": {
                                                        opacity: 1,
                                                    },
                                                },
                                                "& fieldset": { border: 'none' },
                                            }}
                                            placeholder={`${value.count > 1 ? value.count : ''} ${value.code}`}
                                            value={''}
                                            onChange={(e) => {
                                                const num = Number(e.target.value.slice(-1));
                                                if (num === 0) {
                                                    remove(key);
                                                    return;
                                                }
                                                const sideItem = sideItems.get(key) || {} as NonPhoCode;
                                                sideItem.count = num;
                                                setRefresh(!refresh);
                                            }}
                                        />
                                    }
                                />
                                {canEdit && (
                                    <Button onClick={() => copy(key)} variant='outlined' sx={{ m: 0.5, p: 1.1, ml: 0 }} style={{ maxWidth: '30px', minWidth: '34px', maxHeight: '32px', minHeight: '23px' }}>
                                        <FaPlus style={{ fontSize: 26 }} />
                                    </Button>)}
                            </OrderItem>
                        </Grid2>
                    );
                })}
            </Grid2 >
        </List>
    );
}