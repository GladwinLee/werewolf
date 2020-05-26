import React, {useEffect, useState} from 'react';
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import {roleInfo} from "./roleConstants";
import Timer from "./Timer";
import capitalize from "@material-ui/core/utils/capitalize";

export default function PreNightPage({serverMessage, playerName}) {
    const [role, setRole] = useState();
    const [teamMates, setTeamMates] = useState();
    const [waitTime, setWaitTime] = useState();

    useEffect(
        () => {
            const {
                known_roles: knownRoles,
                wait_time: newWaitTime,
            } = serverMessage;
            if (knownRoles) {
                const newPlayerRole = knownRoles[playerName]
                setRole(newPlayerRole);
                if (['mason', 'werewolf', 'minion'].includes(newPlayerRole)) {
                    delete knownRoles[playerName]
                    setTeamMates(Object.entries(knownRoles));
                }
            }
            if (newWaitTime) setWaitTime(newWaitTime);
        },
        [serverMessage]
    )

    const getTeamMateDisplay = () => {
        if (!teamMates) return null;
        if (teamMates.length === 0) {
            let text;
            if (role === 'mason') text = "There is no other Mason";
            if (role === 'werewolf') text = "There are no other Werewolves";
            if (role === 'minion') text = "There are no Werewolves";
            return <Typography variant="h4">{text}</Typography>
        } else {
            return <>
                <Typography variant="h4">Your allies are</Typography>
                {teamMates.map(([name, role]) => {
                    return <Typography
                        variant="h4">{`${name} the ${role}`}</Typography>
                })}
            </>
        }
    }

    return (
        <>
            <Typography variant="h3">{role && `You are a ${capitalize(
                role)}`}</Typography>
            {getTeamMateDisplay()}
            <Typography>{roleInfo[role]}</Typography>
            <Timer start={waitTime} preText={"Night begins in "}/>
        </>
    )
}

PreNightPage.propTypes = {
    serverMessage: PropTypes.object,
    playerName: PropTypes.string.isRequired,
}
