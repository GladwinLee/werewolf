import React, {useState} from 'react';
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import {roleInfo} from "./roleConstants";
import Timer from "./Timer";
import capitalize from "@material-ui/core/utils/capitalize";
import PageGrid from "./PageGrid";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";

export default function PreNightPage({serverMessage, playerName, knownRoles}) {
    const {wait_time: newWaitTime,} = serverMessage;
    const newPlayerRole = knownRoles[playerName];
    let propTeamMates = [];

    if (['mason', 'werewolf', 'minion'].includes(newPlayerRole)) {
        propTeamMates = Object.entries(knownRoles).filter(([name, role]) => (
            name !== playerName));
    }

    const [role, setRole] = useState(newPlayerRole);
    const [teamMates, setTeamMates] = useState(propTeamMates);
    const [waitTime, setWaitTime] = useState(newWaitTime);

    const getTeamMateDisplay = () => {
        if (!teamMates) return null;
        if (teamMates.length === 0) {
            let text;
            if (role === 'mason') text = "There is no other Mason";
            if (role === 'werewolf') text = "There are no other Werewolves";
            if (role === 'minion') text = "There are no Werewolves";
            return <Typography variant="h4">{text}</Typography>
        } else {
            return <Grid item xs={12}>
                <Typography variant="h4">Your allies</Typography>
                <Divider/>
                {teamMates.map(([name, role]) => (
                    <Typography variant="h4" key={`ally-${name}`}>
                        {`${name} the ${role}`}
                    </Typography>)
                )}
            </Grid>
        }
    }

    return (
        <PageGrid height={"80%"} alignContent="space-between">
            <Grid container item xs={12} spacing={3}>
                <Grid item xs={12}>
                    <Typography variant="h3">
                        {role && `You are a ${capitalize(role)}`}
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography style={{whiteSpace: 'pre-line'}}>
                        {roleInfo[role]}
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    {getTeamMateDisplay()}
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Timer start={waitTime} preText={"Night begins in "}/>
            </Grid>
        </PageGrid>
    )
}

PreNightPage.propTypes = {
    serverMessage: PropTypes.object,
    playerName: PropTypes.string.isRequired,
    knownRoles: PropTypes.object.isRequired,
}
