import React, {useEffect, useState} from "react";
import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import capitalize from "@material-ui/core/utils/capitalize";
import TableBody from "@material-ui/core/TableBody";
import Grid from "@material-ui/core/Grid";
import PropTypes from 'prop-types';
import IconButton from "@material-ui/core/IconButton";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import Typography from "@material-ui/core/Typography";
import Collapse from "@material-ui/core/Collapse";
import {roleInfo} from "./roleConstants";

function Row({role}) {
    const [open, setOpen] = useState(false);

    return <>
        <TableRow onClick={() => setOpen(!open)}>
            <TableCell>
                <Grid container direction="row" alignItems="center">
                    <Grid item>
                        <IconButton aria-label="expand row" size="small">
                            {open ? <KeyboardArrowUpIcon/> :
                                <KeyboardArrowDownIcon/>}
                        </IconButton>
                    </Grid>
                    <Grid item>
                        <Typography component={"div"}>{capitalize(
                            role)}</Typography>
                    </Grid>
                </Grid>
            </TableCell>
        </TableRow>
        <TableRow>
            <TableCell style={{paddingBottom: 0, paddingTop: 0}}>
                <Collapse in={open} unmountOnExit>
                    <Typography>{roleInfo[role]}</Typography>
                </Collapse>
            </TableCell>
        </TableRow>
    </>
}

export default function SettingsInfo({settingsMap}) {
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [numWerewolves, setNumWerewolves] = useState(null);
    useEffect(
        () => {
            if (settingsMap == null) {
                return;
            }
            setSelectedRoles(settingsMap['selected_roles']);
            setNumWerewolves(settingsMap['num_werewolves']);
        },
        [settingsMap]
    )

    const display = selectedRoles.map(
        (role) => <Row role={role} key={"role-" + role}/>
    );

    return (
        <>
            <Typography variant="h4">Selected Roles</Typography>
            <Table size={"small"}>
                <TableBody>
                    <TableRow><TableCell>
                        <Typography>{numWerewolves
                        && `${numWerewolves} Werewolves`} </Typography>
                    </TableCell></TableRow>
                    {display}
                </TableBody>
            </Table>
        </>
    )
}

SettingsInfo.propTypes = {
    settingsMap: PropTypes.object,
}

SettingsInfo.defaultProps = {
    settingsMap: {},
}
