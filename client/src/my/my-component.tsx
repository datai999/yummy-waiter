import React, { ReactNode, useContext, useEffect, useState } from 'react';

import {
    FaMinus,
    FaPlus,
} from 'react-icons/fa';

import {
    Badge,
    Box,
    Button,
    Chip,
    Grid2,
    List,
    ListItemText,
    Paper,
    styled,
    TextField,
    Typography,
} from '@mui/material';
import {
    CategoryButton,
} from './my-styled';
import { AuthContext } from '../App';
import YummyLogo from '../assets/yummy.png';
import { GiChicken } from 'react-icons/gi';
import { PiCow } from 'react-icons/pi';
import { RiDrinks2Line } from 'react-icons/ri';

interface CheckButtonProps {
    multi: boolean,
    obj: Object,
    disabled?: string[],
    options: string[],
    createLabel?: (option: string) => string,
    callback: (next: string[]) => void,
    setting?: boolean,
}

// TODO: improve performance
// const checkButtonPropsEqual = (prev: CheckButtonProps, next: CheckButtonProps) =>
//     [...prev.options].sort().join(',') === [...next.options].sort().join(',')
//     && [...prev.allOptions].sort().join(',') === [...next.allOptions].sort().join(',')
//     && true;
const checkButtonPropsEqual = () => false;
export const CheckButton = (props: CheckButtonProps) => {
    const [options, setOptions] = useState<string[]>([...props.options]);

    useEffect(() => {
        setOptions([...props.options])
    }, [props.options])

    const onClick = (option: string) => {
        const newOptions = options.includes(option)
            ? options.filter((e) => e !== option)
            : props.multi ? [...options, option] : [option];
        // setOptions([...newOptions]);
        props.callback([...newOptions.filter(e => e!)]);
    }

    const getProperty = (option: string, name: string) => {
        if (!props.obj) return null;
        const itemObj = props.obj[option as keyof typeof props.obj];
        if (itemObj instanceof Object) {
            const property = `${itemObj[name as keyof Object]}`;
            if (name === 'code') {
                return property !== 'undefined' ? property : '';
            }
            return property;
        }
        return null;
    }

    return (
        <>
            <Grid2 container spacing={0} sx={{ display: { xs: 'none', sm: 'flex', md: 'flex', lg: 'flex' }, mb: 0, mt: 0 }}>
                {Object.entries(props.obj).map(([key, value]) => {
                    const disabledStyle = props.setting && value?.disabled ? { color: 'text.disabled', borderColor: 'text.disabled' } : {};
                    return (
                        <Grid2 key={key}>
                            <Badge badgeContent={null} anchorOrigin={{ vertical: 'top', horizontal: 'right', }} >
                                <CategoryButton
                                    disabled={props.disabled?.includes(key) || (!props.setting && value?.disabled)}
                                    variant='outlined'
                                    size='large'
                                    onClick={() => onClick(key)}
                                    selected={options?.includes(key)}
                                    sx={{ ...disabledStyle, minWidth: 100, maxWidth: 200, minHeight: 50 }}
                                >
                                    {key}
                                </CategoryButton>
                                {props.setting && <Box sx={{ ...disabledStyle, position: "absolute", top: -3, right: 1, zIndex: 1, bgcolor: "background.paper", border: '1px solid', borderRadius: 0, fontSize: 12 }} >
                                    {getProperty(key, 'code')}
                                </Box>}
                                {props.setting && <Box sx={{ ...disabledStyle, position: "absolute", top: 34, right: 1, zIndex: 1, bgcolor: "background.paper", border: '1px solid', borderRadius: 0, fontSize: 12 }} >
                                    {getProperty(key, 'price')}
                                </Box>}
                            </Badge>
                        </Grid2>
                    )
                })}
            </Grid2 >
            <Grid2 container spacing={0} sx={{ display: { xs: 'flex', sm: 'none', md: 'none', lg: 'none' }, mb: 0 }}>
                {Object.entries(props.obj).map(([key, value]) => (
                    <Grid2 key={key}>
                        <Chip
                            label={key}
                            onClick={() => onClick(key)}
                            color={options?.includes(key) ? "primary" : "default"}
                        />
                    </Grid2>
                ))}
            </Grid2>
        </>
    );
}
// export const CheckButton = React.memo(pCheckButton, checkButtonPropsEqual);

const NumberInput = (props: {
    value: any,
    onChange: (num: number) => void,
    placeholder?: string,
    label?: string,
    inputProps?: {},
    sx?: {}
}) => {
    return (<TextField margin="none" size='small'
        type='number'
        inputProps={{ inputMode: 'numeric', style: props.inputProps, }}
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
            ...props.sx,
            input: {
                color: 'primary',
                "&::placeholder": {
                    opacity: 1,
                },
            },
        }}
        label={props.label}
        placeholder={props.placeholder}
        value={props.value}
        onChange={(e) => {
            const num = Number(e.target.value);
            props.onChange(num);
        }}
    />);
}

const PriceInput = (props: {
    value: number | undefined | string,
    onChange: (num: number) => void,
    placeholder?: string,
    label?: string,
    inputProps?: {},
    sx?: {}
}) => {
    return <NumberInput
        value={props.value}
        onChange={num => {
            const correctPrice = num.toString().length > (props.value || 0)?.toString().length
                ? num * 10 : num / 10;
            props.onChange(Number(correctPrice.toFixed(2)))
        }}
        sx={props.sx}
    />
}

export const NumPad = (props: { clear: () => void, input: (key: string) => void, done: () => void }) => {

    const inputKey = (key: string) => {
        if (key === 'x') props.clear();
        else if (key === '->') props.done();
        else props.input(key);
    }

    return (<Grid2 container spacing={1} sx={{ maxWidth: 500 }}>
        {['7', '8', '9', '4', '5', '6', '1', '2', '3', 'x', '0'].map(key =>
            <Grid2 key={key} size={4}>
                <Button
                    variant="outlined"
                    color="primary"
                    onMouseDown={() => inputKey(key)}
                    fullWidth
                    sx={{ minHeight: 70, maxHeight: 5, borderRadius: '32px' }}
                >
                    <Typography variant="h5">
                        {key}
                    </Typography>
                </Button>
            </Grid2>)}
        <Grid2 size={4}>
            <Button
                variant="outlined"
                color="primary"
                onClick={() => inputKey('->')}
                fullWidth
                sx={{ minHeight: 70, maxHeight: 5, borderRadius: '32px' }}
            >
                <Typography variant="h5">
                    {'->'}
                </Typography>
            </Button>
        </Grid2>
    </Grid2>)
}

const LogoImage = styled("img")({
    width: "60px",
    height: "60px",
    marginLeft: "16px",
    objectFit: "contain"
});

const LogoImageXS = styled("img")({
    width: "40px",
    height: "40px",
    marginLeft: "10px",
    marginRight: "10px",
    objectFit: "contain"
});

const StyledHeaderPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(1),
    paddingTop: 2,
    paddingBottom: 1,
    backgroundColor: "#fff",
    borderRadius: theme.shape.borderRadius,
}));

const Header = (props: {
    back: () => void,
    actions: ReactNode,
}) => {
    const { auth } = useContext(AuthContext);

    return (
        <StyledHeaderPaper sx={{ display: 'flex', direction: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', direction: 'row', alignItems: 'center' }}>
                <LogoImage src={YummyLogo} alt="Yummy Logo" sx={{ display: { xs: 'none', sm: 'block' } }} onClick={() => props.back()} />
                <LogoImageXS src={YummyLogo} alt="Yummy Logo" sx={{ display: { xs: 'block', sm: 'none' } }} onClick={() => props.back()} />
                <Typography fontWeight='fontWeightMedium' variant="h4" sx={{ textAlign: "center", display: 'flex', ml: 1 }}>
                    Yummy Phở 2
                </Typography>
                <Typography fontWeight='fontWeightMedium' variant="h5" sx={{ textAlign: "center", display: 'flex', ml: 1, mt: 1 }}>
                    : {auth.name}
                </Typography>
            </Box>
            {props.actions}
        </StyledHeaderPaper >);
}

const WrapCategoryButton = ({ props }: {
    props: {
        size: string,
        selectedCategory: string,
        category: string, setCategory: React.Dispatch<string>,
        icon?: ReactNode
    }
}) => {
    return (<CategoryButton
        key={props.category}
        selected={props.selectedCategory === props.category}
        onClick={() => props.setCategory(props.category)}
        variant="contained"
        size={props.size == "small" ? "small" : props.size == "medium" ? "medium" : "large"}
        sx={{
            minHeight: props.size == 'xlarge' ? 50 : 0,
            minWidth: props.size == 'xlarge' ? 120 : props.size === 'large' ? 120 : 0,
            ml: '5px'
        }}
    >
        {props.category}
        {props.size === 'xlarge' && props.category === 'BEEF' && <PiCow style={{ fontSize: 25, marginLeft: 12 }} />}
        {props.size === 'xlarge' && props.category === 'CHICKEN' && <GiChicken style={{ fontSize: 25, marginLeft: 12 }} />}
        {props.size === 'xlarge' && props.category === 'DRINK' && <RiDrinks2Line style={{ fontSize: 25, marginLeft: 12 }} />}
        {props.size === 'xlarge' && props.icon && props.icon}
    </CategoryButton>)
}

export const COMPONENT = {
    Header,
    WrapCategoryButton,
    NumberInput,
    PriceInput,
    CheckButton
}