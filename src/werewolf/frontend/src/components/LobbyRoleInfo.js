import React, {useEffect, useState} from "react";
import capitalize from "@material-ui/core/utils/capitalize";
import Grid from "@material-ui/core/Grid";
import PropTypes from 'prop-types';
import Typography from "@material-ui/core/Typography";
import {roleInfo} from "./roleConstants";
import Tooltip from "@material-ui/core/Tooltip";

function Role({role}) {
    return <Grid item xs={6}>
        <Tooltip title={roleInfo[role]} enterTouchDelay={150} arrow
                 placement="top">
            <Typography align="center">
                {capitalize(role)}
            </Typography>
        </Tooltip>
    </Grid>
}

export default function LobbyRoleInfo({settingsMap}) {
    const {
        selected_roles: propSelectedRoles,
        num_werewolves: propNumWerewolves,
    } = settingsMap;

    const [selectedRoles, setSelectedRoles] = useState([]);
    const [numWerewolves, setNumWerewolves] = useState(null);
    useEffect(
        () => {
            if (settingsMap == null) return;
            setSelectedRoles(propSelectedRoles);
            setNumWerewolves(propNumWerewolves);
        },
        [settingsMap]
    )

    const display = selectedRoles.map(
        role => <Role role={role} key={"role-" + role}/>);

    return (
        <Grid container item xs={12} spacing={3}>
            <Grid item xs={12}>
                <Typography variant="h4" align="center">Selected
                    Roles</Typography>
                <Typography align="center">
                    {numWerewolves && `${numWerewolves} Werewolves`}
                </Typography>
            </Grid>
            {display}
        </Grid>
    )
}

LobbyRoleInfo.propTypes = {
    settingsMap: PropTypes.object,
}

LobbyRoleInfo.defaultProps = {
    settingsMap: {},
}
