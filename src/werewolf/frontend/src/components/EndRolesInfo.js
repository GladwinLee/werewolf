import React, {useState} from 'react';
import Typography from "@material-ui/core/Typography";
import capitalize from "@material-ui/core/utils/capitalize";
import PropTypes from "prop-types";
import {teamRoles} from "./roleConstants";

const middle = ["Middle 1", "Middle 2", "Middle 3"];

export default function EndRolesInfo(props) {
    const [initialData, setInitialData] = useState(props);
    const {
        playersToRoles,
        winners,
    } = initialData;

    const [middleRoles, setMiddleRoles] = useState(
        middle.map(m => (
            capitalize(playersToRoles[m]))));

    const rolesToPlayers = {}
    Object.entries(playersToRoles).filter(
        ([name, role]) => !middle.includes(name)).map(
        ([playerName, role]) => {
            rolesToPlayers[role] = rolesToPlayers[role] || [];
            rolesToPlayers[role].push(playerName);
        }
    )
    const rolesList = [...new Set(Object.values(playersToRoles))];
    const [winningRoles, losingRoles] = rolesList.reduce(
        (res, role) => {
            (winners.some(winner => teamRoles[winner].has(role))) ?
                res[0].push(role) : res[1].push(role)
            return res;
        }, [[], []])

    return (
        <div>
            <Typography variant="h3">Winners</Typography>
            <RoleToPlayer rolesToPlayers={rolesToPlayers} roles={winningRoles}/>
            <Typography variant="h3">Losers</Typography>
            <RoleToPlayer rolesToPlayers={rolesToPlayers} roles={losingRoles}/>
            <Typography variant="h4">Middle Roles</Typography>
            <Typography>{middleRoles.join(", ")}</Typography>
        </div>
    );
}

EndRolesInfo.propTypes = {
    playersToRoles: PropTypes.object.isRequired,
    winners: PropTypes.arrayOf(PropTypes.string).isRequired,
}

function RoleToPlayer({rolesToPlayers, roles}) {
    const rtp = Object.entries(rolesToPlayers).filter(
        ([role, name]) => roles.includes(role));
    if (rtp.length === 0) return <Typography variant="h5">None</Typography>
    return rtp.map(([role, names]) => (
        <Typography key={"rtp-" + role}>
            {`${capitalize(role)}: ${names.join(", ")}`}
        </Typography>
    ))
}