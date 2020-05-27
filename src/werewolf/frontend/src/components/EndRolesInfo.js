import React from 'react';
import Typography from "@material-ui/core/Typography";
import capitalize from "@material-ui/core/utils/capitalize";
import PropTypes from "prop-types";
import {teamRoles} from "./roleConstants";

const middle = ["Middle 1", "Middle 2", "Middle 3"];

export default function EndRolesInfo({playersToRoles, winners}) {
    const middleRoles = [];
    middle.forEach(m => {
        middleRoles.push(playersToRoles[m]);
        delete playersToRoles[m];
    });

    const rolesToPlayers = {}
    Object.entries(playersToRoles).map(
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
            <Typography variant="h4">Middle</Typography>
            <Typography variant="h5">{middleRoles.join(", ")}</Typography>
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
    return rtp.map(([role, names]) => (
        <Typography key={"rtp-" + role} variant="h5">
            {`${capitalize(role)}: ${names.join(", ")}`}
        </Typography>
    ))
}