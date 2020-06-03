import React, {useState} from 'react';
import Typography from "@material-ui/core/Typography";
import capitalize from "@material-ui/core/utils/capitalize";
import PropTypes from "prop-types";
import {teamRoles} from "../roleConstants";
import makeStyles from "@material-ui/core/styles/makeStyles";

const middle = ["Middle 1", "Middle 2", "Middle 3"];

const useStyles = makeStyles(theme => ({
    bold: {
        fontWeight: "bold",
    },
}))

export default function EndRolesInfo(props) {
    const classes = useStyles(props);
    const [initialData] = useState(props);
    const {
        playersToRoles,
        winners,
    } = initialData;

    const [middleRoles] = useState(
        middle.map(m => (
            capitalize(playersToRoles[m]))));

    const rolesToPlayers = {}
    Object.entries(playersToRoles).filter(
        ([name]) => !middle.includes(name)).map(
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
        <>
            <Typography variant="h4"
                        className={classes.bold}>Winners</Typography>
            <RoleToPlayer rolesToPlayers={rolesToPlayers} roles={winningRoles}/>
            <Typography variant="h4"
                        className={classes.bold}>Losers</Typography>
            <RoleToPlayer rolesToPlayers={rolesToPlayers} roles={losingRoles}/>
            <Typography variant="h5" className={classes.bold}>Middle
                Roles</Typography>
            <Typography>{middleRoles.join(", ")}</Typography>
        </>
    );
}

EndRolesInfo.propTypes = {
    playersToRoles: PropTypes.object.isRequired,
    winners: PropTypes.arrayOf(PropTypes.string).isRequired,
}

function RoleToPlayer({rolesToPlayers, roles}) {
    const rtp = Object.entries(rolesToPlayers).filter(
        ([role]) => roles.includes(role));
    if (rtp.length === 0) return <Typography variant="h5">None</Typography>
    return rtp.map(([role, names]) => (
        <Typography key={"rtp-" + role}>
            {`${capitalize(role)}: ${names.join(", ")}`}
        </Typography>
    ))
}