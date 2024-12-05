import React from 'react';

import {
  Chip,
  Grid2,
} from '@mui/material';

import { CategoryButton } from './my-styled';

interface Props {
    multi: boolean,
    allOptions: string[],
    options?: string[],
    createLabel: (option: string) => string,
    callback: ([]) => void,
}

export const CheckButton = ({ multi, allOptions, options = [], createLabel, callback }: Props) => {
    return (
        <>
            <Grid2 container spacing={1} sx={{ display: { xs: 'none', sm: 'none', md: 'flex', lg: 'flex' }, mb: 1 }}>
                {allOptions.map((option) => (
                    <Grid2 key={option}>
                        <CategoryButton
                            variant='outlined'
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
                            selected={options?.includes(option)}
                        >
                            {createLabel(option)}
                        </CategoryButton>
                    </Grid2>
                ))}
            </Grid2>
            <Grid2 container spacing={1} sx={{ display: { xs: 'flex', sm: 'flex', md: 'none', lg: 'none' }, mb: 1 }}>
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