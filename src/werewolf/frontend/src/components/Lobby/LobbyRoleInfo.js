import React, {useEffect, useState} from "react";
import capitalize from "@material-ui/core/utils/capitalize";
import Grid from "@material-ui/core/Grid";
import PropTypes from 'prop-types';
import Typography from "@material-ui/core/Typography";
import RoleTooltip from "../RoleTooltip";
import {roleInfo} from "../roleConstants";

function Role({role, strikeThrough: selected}) {
    return <Grid item xs={6}>
        <RoleTooltip role={role}>
            <Typography align="center" style={{
                borderStyle: selected && "solid",
                borderWidth: "1px",
                borderRadius: "6px",
                borderColor: "#ccc"
            }}>
                {capitalize(role)}
            </Typography>
        </RoleTooltip>
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

    const display = Object.keys(roleInfo).map(
        role => <Role role={role} strikeThrough={!!selectedRoles.includes(role)} key={"role-" + role}/>);

    return (
        <Grid container item xs={12}>
            <Grid item xs={12}>
                <Typography variant="h4" align="center">Selected
                    Roles</Typography>
                <Typography align="center">
                    {numWerewolves && `Werewolves x${numWerewolves}`}
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
