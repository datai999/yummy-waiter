import React from 'react';

import {
  Chip,
  Grid2,
} from '@mui/material';

interface Props {
    multi: boolean,
    allOptions: string[],
    options?: string[],
    createLabel: (option: string) => string,
    callback: ([]) => void,
}

export const CheckButton = ({ multi, allOptions, options = [], createLabel, callback }: Props) => {
    return (
        <Grid2 container spacing={1} sx={{ mb: 1 }}>
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
        </Grid2>);
}