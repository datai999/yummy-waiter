import React, { useEffect, useState } from 'react';

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
import { NonPho } from './my-class';
import { Draggable } from '../waiter/BagDnd';

interface CheckButtonProps {
    multi: boolean,
    allOptions: string[],
    options: string[],
    createLabel: (option: string) => string,
    callback: (next: string[]) => void,
}

// TODO: improve performance
// const checkButtonPropsEqual = (prev: CheckButtonProps, next: CheckButtonProps) =>
//     [...prev.options].sort().join(',') === [...next.options].sort().join(',')
//     && [...prev.allOptions].sort().join(',') === [...next.allOptions].sort().join(',')
//     && true;
const checkButtonPropsEqual = () => false;
const pCheckButton = ({ ...props }: CheckButtonProps) => {
    const [options, setOptions] = useState<string[]>([...props.options]);

    useEffect(() => {
        setOptions([...props.options])
    }, [props.options])

    const onClick = (option: string) => {
        const newOptions = options.includes(option)
            ? options.filter((e) => e !== option)
            : props.multi ? [...options, option] : [option];
        setOptions([...newOptions]);
        props.callback([...newOptions]);
    }

    return (
        <>
            <Grid2 container spacing={1} sx={{ display: { xs: 'none', sm: 'flex', md: 'flex', lg: 'flex' }, mb: 1 }}>
                {props.allOptions.map((option) => (
                    <Grid2 key={option}>
                        <CategoryButton
                            variant='outlined'
                            size='large'
                            onClick={() => onClick(option)}
                            selected={options?.includes(option)}
                        >
                            {props.createLabel(option)}
                        </CategoryButton>
                    </Grid2>
                ))}
            </Grid2>
            <Grid2 container spacing={1} sx={{ display: { xs: 'flex', sm: 'none', md: 'none', lg: 'none' }, mb: 1 }}>
                {props.allOptions.map((option) => (
                    <Grid2 key={option}>
                        <Chip
                            label={props.createLabel(option)}
                            onClick={() => onClick(option)}
                            color={options?.includes(option) ? "primary" : "default"}
                        />
                    </Grid2>
                ))}
            </Grid2>
        </>
    );
}
export const CheckButton = React.memo(pCheckButton, checkButtonPropsEqual);

export const NumberInput = (props: {
    value: any,
    onChange: (num: number) => void,
    nonBorder?: boolean
    placeholder?: string,
    label?: string,
    pl?: number
}) => {

    const style = { fontSize: 16, fontWeight: 600 };
    const plStyle = props.pl && props.pl < 0 ? style : { ...style, paddingLeft: props.pl };

    return (<TextField margin="none" size='small'
        type='number'
        label={props.label}
        inputProps={{ inputMode: 'numeric', style: plStyle, }}
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
            "& fieldset": { border: props.nonBorder ? 'none' : '' },
        }}
        placeholder={props.placeholder}
        value={props.value}
        onChange={(e) => {
            const num = Number(e.target.value.slice(-1));
            props.onChange(num);
        }}
    />)
}

export const SideItemList = ({ bag, category, canEdit, sideItems, doubleCol = true }: {
    bag: number,
    category: string,
    canEdit: boolean;
    sideItems: Map<String, NonPho>,
    doubleCol?: boolean,
}) => {
    const [refresh, setRefresh] = useState<Boolean>(false);

    const copy = (itemId: String) => {
        const newItem = { ...sideItems.get(itemId), id: generateId() } as NonPho;
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
                                <Draggable id={`nonPho_${bag}_${category}_${key}`} enable={canEdit}>
                                    <ListItemText
                                        id={key as string}
                                        primaryTypographyProps={{ style: { fontWeight: "bold", fontSize: 16 } }}
                                        secondaryTypographyProps={{ style: { color: "#d32f2f" } }}
                                        sx={{ p: 0, m: 0 }}
                                        primary={<NumberInput
                                            value={''}
                                            placeholder={`${value.count > 1 ? value.count : ''} ${value.code}`}
                                            onChange={num => {
                                                if (num === 0) {
                                                    remove(key);
                                                    return;
                                                }
                                                const sideItem = sideItems.get(key) || {} as NonPho;
                                                sideItem.count = num;
                                                setRefresh(!refresh);
                                            }}
                                            nonBorder={true}
                                            pl={0}
                                        />}
                                    />
                                </Draggable>
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