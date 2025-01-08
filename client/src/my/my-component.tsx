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
            <Grid2 container spacing={0} sx={{ display: { xs: 'none', sm: 'flex', md: 'flex', lg: 'flex' }, mb: 0, mt: 0 }}>
                {props.allOptions.map((option) => (
                    <Grid2 key={option}>
                        <CategoryButton
                            variant='outlined'
                            size='large'
                            onClick={() => onClick(option)}
                            selected={options?.includes(option)}
                            sx={{ minWidth: 100, maxWidth: 200 }}
                        >
                            {props.createLabel(option)}
                        </CategoryButton>
                    </Grid2>
                ))}
            </Grid2>
            <Grid2 container spacing={0} sx={{ display: { xs: 'flex', sm: 'none', md: 'none', lg: 'none' }, mb: 0 }}>
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