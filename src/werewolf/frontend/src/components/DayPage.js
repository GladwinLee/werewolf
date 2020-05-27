import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import RadioChoice from "./RadioChoice";
import Timer from "./Timer";
import Typography from "@material-ui/core/Typography";
import capitalize from "@material-ui/core/utils/capitalize";
import Button from "@material-ui/core/Button";
import RoleInfoDialog from "./RoleInfoDialog";
import Tooltip from "@material-ui/core/Tooltip";
import SecurityIcon from "@material-ui/icons/Security";
import Grid from "@material-ui/core/Grid";

export default function DayPage({socket, serverMessage, roles}) {
    const [initialMessage, setInitialMessage] = useState(serverMessage);
    let {
        choices,
        default: defaultChoice,
        disabledChoices,
        wait_time: waitTime,
        player_labels: playerLabels
    } = initialMessage;

    const [selectedChoice, setSelectedChoice] = useState();
    const [showDialog, setShowDialog] = useState(false);
    const [disableChoices, setDisableChoices] = useState(false);

    useEffect(() => {
        if (defaultChoice) setSelectedChoice(defaultChoice);
    }, [defaultChoice])

    const sendChoice = () => {
        socket.send(JSON.stringify({
            'type': "action",
            'action_type': "vote",
            'choice': selectedChoice,
        }));
        setDisableChoices(true);
    }

    useEffect(
        () => {
        },
        [serverMessage]
    )

    return (
        <>
            <Typography variant="h3">Vote</Typography>
            <Button variant="contained"
                    onClick={() => setShowDialog(true)}>Roles</Button>
            <RadioChoice
                choices={choices}
                onSubmit={sendChoice}
                onChange={setSelectedChoice}
                default={defaultChoice}
                disabledChoices={disabledChoices}
                disableAll={disableChoices}
                specialChoiceLabels={getSpecialLabels(playerLabels)}
            />
            <Timer start={waitTime} preText={"Time Remaining "}/>
            <RoleInfoDialog
                roles={roles}
                open={showDialog}
                handleClose={() => setShowDialog(false)}
            />
        </>
    )
}

DayPage.propTypes = {
    socket: PropTypes.object,
    serverMessage: PropTypes.object,
    roles: PropTypes.arrayOf(PropTypes.string),
}

DayPage.defaultProps = {
    players: [],
    serverMessage: {},
}

function getSpecialLabels(playerLabels) {
    if (playerLabels == null) return;
    const specialLabels = {}
    Object.entries(playerLabels).forEach(
        ([playerName, label]) => {
            if (label === "shielded") {
                specialLabels[playerName] =
                    <ShieldedLabel playerName={playerName}/>
            } else {
                specialLabels[playerName] =
                    <span>{`${playerName} (${capitalize(label)})`}</span>
            }
        }
    )
    return specialLabels;
}

function ShieldedLabel({playerName}) {
    return <Grid container>
        <Grid item>
            {playerName}
        </Grid>
        <Grid item>
            <Tooltip title={"Shielded by the Sentinel"} arrow>
                <SecurityIcon/>
            </Tooltip>
        </Grid>
    </Grid>

}