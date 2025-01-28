import { Box } from '@mui/material';
import React from 'react';
import { MdOutlineBrowserUpdated } from 'react-icons/md';
import { COMPONENT } from '../my/my-component';

export default function ServerManagement(props: { back: () => void }) {

    const saveThenSync = () => {
        // TODO: check unique
    }

    return (<>
        <COMPONENT.Header back={props.back} actions={<Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <Box sx={{ ml: 5 }}>
                <COMPONENT.WrapCategoryButton props={{
                    selectedCategory: 'Save & Sync', category: 'Save & Sync', setCategory: saveThenSync,
                    size: 'xlarge', icon: <MdOutlineBrowserUpdated style={{ fontSize: 25, marginLeft: 2 }} />,
                }} />
            </Box>
        </Box>} />
    </>);
}