import React, { useContext, useState } from 'react';
import { StyledPaper } from '../my/my-styled';
import { Box, Button, Divider, Grid2, Modal, Stack, Typography } from '@mui/material';
import { GiPaperBagFolded } from 'react-icons/gi';
import { FaChevronRight, FaExchangeAlt } from 'react-icons/fa';
import { MdOutlineBorderColor, MdTableRestaurant } from 'react-icons/md';
import { AiOutlineFileDone } from "react-icons/ai";
import { CgArrowsExchange } from "react-icons/cg";
import { RxExit } from "react-icons/rx";
import { CONTEXT } from '../App';
import { FaFileSignature } from "react-icons/fa";
import { SiCcleaner } from "react-icons/si";
import { BsCashCoin } from "react-icons/bs";

const iconStyle = {
    fontSize: 30, marginLeft: 8
}

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: "16px",
    boxShadow: 24,
    p: 4,
};

export default function Footer(props: {
    addTogoBag: () => void,
    changeTable: () => void,
    submitOrder: () => void,
    customerInfo: () => void,
    openCashier: () => void,
    doneOrder: () => void
}) {
    const { logout } = useContext(CONTEXT.Auth);
    const { table, orderTable } = useContext(CONTEXT.Table);
    const [openModal, setOpen] = useState(false);

    const lockedTable = Boolean(useContext(CONTEXT.LockedTable)(table.id));

    return (<Stack direction="row" spacing={1} sx={{
        justifyContent: "center",
        alignItems: "stretch",
    }}>
        <Button variant="contained" color="primary" sx={{ minHeight: 50 }} onClick={() => logout()} >
            Cancel
            <RxExit style={iconStyle} />
        </Button>
        <Button variant="contained" color="primary" disabled={lockedTable} onClick={props.addTogoBag} >
            Add togo
            <GiPaperBagFolded style={iconStyle} />
        </Button>
        <Button variant="contained" color="primary" disabled={lockedTable} onClick={props.changeTable} >
            Change table
            <CgArrowsExchange style={iconStyle} />
        </Button>
        {/* <Button variant="contained" color="primary" disabled={lockedTable} onClick={props.customerInfo} >
            Customer
            <MdOutlinePersonPin style={iconStyle} />
        </Button> */}
        {/* <Button variant="contained" color="primary" disabled={lockedTable} sx={{ minHeight: 50 }} onClick={() => setOpen(true)} >
            Clean
            <SiCcleaner style={iconStyle} />
        </Button> */}
        <Button variant="contained" color="primary" disabled={lockedTable} onClick={() => {
            props.submitOrder();
            orderTable(null);
        }} >
            Next order
            <FaFileSignature style={iconStyle} />
        </Button>
        <Button variant="contained" color="primary" disabled={lockedTable} onClick={() => {
            props.submitOrder();
            logout();
        }} >
            Done order
            <AiOutlineFileDone style={iconStyle} />
        </Button>
        <Button variant="contained" color="primary" disabled={lockedTable} onClick={props.openCashier} >
            Cash
            <BsCashCoin style={iconStyle} />
        </Button>
        <Modal
            open={openModal}
            onClose={() => setOpen(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={modalStyle}>
                <Typography variant="h4" fontWeight='fontWeightMedium' >
                    Clean up your order ?
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: "space-around", width: '100%', mt: 3 }}>
                    <Button variant="contained" color="primary" sx={{ minHeight: 50 }} onClick={props.doneOrder} >
                        Clean
                        <SiCcleaner style={iconStyle} />
                    </Button>
                    <Button variant="contained" color="primary" sx={{ minHeight: 50 }} onClick={() => setOpen(false)} >
                        Cancel
                        <RxExit style={iconStyle} />
                    </Button>
                </Box>
            </Box>
        </Modal>
    </Stack >
    )
}