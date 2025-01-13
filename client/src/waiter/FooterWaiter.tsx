import React, { useContext, useState } from 'react';
import { StyledPaper } from '../my/my-styled';
import { Button, Divider, Grid2, Stack } from '@mui/material';
import { GiPaperBagFolded } from 'react-icons/gi';
import { FaChevronRight, FaExchangeAlt } from 'react-icons/fa';
import { MdOutlineBorderColor, MdTableRestaurant } from 'react-icons/md';
import { AiOutlineFileDone } from "react-icons/ai";
import { CgArrowsExchange } from "react-icons/cg";
import { RxExit } from "react-icons/rx";
import { CONTEXT } from '../App';
import { FaFileSignature } from "react-icons/fa";
import { SiCcleaner } from "react-icons/si";

const iconStyle = {
    fontSize: 30, marginLeft: 8
}

export default function Footer(props: {
    addTogoBag: () => void,
    changeTable: () => void,
    submitOrder: () => void,
}) {
    const { logout } = useContext(CONTEXT.Auth);
    const { table, orderTable } = useContext(CONTEXT.Table);

    const lockedTable = Boolean(useContext(CONTEXT.LockedTable)(table.id));

    return (<Stack direction="row" spacing={2} sx={{
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
        <Button variant="contained" color="primary" disabled={lockedTable} sx={{ minHeight: 50 }} onClick={() => alert('TODO:Clear')} >
            Clean
            <SiCcleaner style={iconStyle} />
        </Button>
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
    </Stack >
    )
}