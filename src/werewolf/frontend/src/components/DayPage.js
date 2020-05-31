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
import PageGrid from "./PageGrid";
import {makeStyles} from "@material-ui/core/styles";
import InfoMessagesDialog from "./InfoMessagesDialog";

const useStyles = makeStyles(theme => ({
    choiceGrid: {
        justifyContent: "center",
        padding: [["0px", theme.spacing(2)]],
    },
}));
export default function DayPage({socket, serverMessage, roleCount, infoMessages, ...props}) {
    const classes = useStyles(props);

    const [initialMessage, setInitialMessage] = useState(serverMessage);
    let {
        choices,
        default: defaultChoice,
        disabledChoices,
        wait_time: waitTime,
        player_labels: playerLabels,
    } = initialMessage;

    const [selectedChoice, setSelectedChoice] = useState();
    const [showRoleInfoDialog, setShowRoleInfoDialog] = useState(false);
    const [showInfoMessagesDialog, setShowInfoMessagesDialog] = useState(false);
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
        <PageGrid justify="space-between">
            <Grid container item xs={12} justify="space-around">
                <Grid item xs={4}>
                    <Button
                        variant="contained"
                        onClick={() => setShowInfoMessagesDialog(true)}
                        size="small"
                    >
                        Messages
                    </Button>
                </Grid>
                <Grid item xs={4}>
                    <Typography variant="h3">Vote</Typography>
                </Grid>
                <Grid item xs={4}>
                    <Button
                        variant="contained"
                        onClick={() => setShowRoleInfoDialog(true)}
                        size="small"
                    >
                        Roles
                    </Button>
                </Grid>
            </Grid>
            <Grid item xs={12} className={classes.choiceGrid}>
                <RadioChoice
                    choices={choices}
                    onSubmit={sendChoice}
                    onChange={setSelectedChoice}
                    default={defaultChoice}
                    disabledChoices={disabledChoices}
                    disableAll={disableChoices}
                    specialChoiceLabels={getSpecialLabels(playerLabels)}
                />
            </Grid>
            <Grid item xs={12}>
                <Timer start={waitTime} preText={"Time Remaining "}/>
            </Grid>
            <RoleInfoDialog
                roleCount={roleCount}
                open={showRoleInfoDialog}
                handleClose={() => setShowRoleInfoDialog(false)}
            />
            <InfoMessagesDialog
                infoMessages={infoMessages}
                open={showInfoMessagesDialog}
                handleClose={() => setShowInfoMessagesDialog(false)}
            />
        </PageGrid>
    )
}

DayPage.propTypes = {
    socket: PropTypes.object,
    serverMessage: PropTypes.object,
    roleCount: PropTypes.object,
    infoMessages: PropTypes.arrayOf(PropTypes.string),
}

DayPage.defaultProps = {
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
    return <Grid container justify="center" alignItems="center">
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