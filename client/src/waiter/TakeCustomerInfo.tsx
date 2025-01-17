import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { MdOutlineDone, MdCancel } from 'react-icons/md';
import { CONTEXT } from '../App';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: "16px",
    boxShadow: 24,
    p: 3,
};

export default function TakeCustomerInfo(props: { openModal: boolean, closeModel: () => void }) {
    const { table } = useContext(CONTEXT.Table);

    const [note, setNote] = useState<string>(table.note || '');

    const doneTakeCustomerInfo = () => {
        table.note = note;
        props.closeModel();
    }

    return (<Modal
        open={props.openModal}
        onClose={props.closeModel}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
    >
        <Box sx={modalStyle}>
            <Typography variant="h4" fontWeight='fontWeightMedium' sx={{ mb: 2 }} >
                Note customer info
            </Typography>
            <TextField
                fullWidth
                label="Customer name, phone, pickup time, ..."
                size='medium'
                multiline
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
            />
            <Box sx={{ display: 'flex', justifyContent: "space-around", width: '100%', mt: 3 }}>
                <Button variant="contained" color="primary" sx={{ minHeight: 50, borderRadius: 5, minWidth: 130 }}
                    onClick={doneTakeCustomerInfo} >
                    Save
                    <MdOutlineDone style={{ fontSize: 30, marginLeft: 8 }} />
                </Button>
                <Button variant="contained" color="primary" sx={{ minHeight: 50, borderRadius: 5, minWidth: 130 }}
                    onClick={props.closeModel} >
                    Cancel
                    <MdCancel style={{ fontSize: 30, marginLeft: 8 }} />
                </Button>
            </Box>
        </Box>
    </Modal>)
}