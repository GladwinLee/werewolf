import React, {useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import RadioChoice from "../RadioChoice";
import Timer from "../Timer";
import Typography from "@material-ui/core/Typography";
import capitalize from "@material-ui/core/utils/capitalize";
import Button from "@material-ui/core/Button";
import RoleInfoDialog from "./RoleInfoDialog";
import Tooltip from "@material-ui/core/Tooltip";
import SecurityIcon from "@material-ui/icons/Security";
import Grid from "@material-ui/core/Grid";
import PageGrid from "../PageGrid";
import {makeStyles} from "@material-ui/core/styles";
import InfoMessagesDialog from "./InfoMessagesDialog";
import WebSocketContext from "../WebSocketContext";
import CheckBoxOutlineBlankOutlinedIcon from '@material-ui/icons/CheckBoxOutlineBlankOutlined';
import CheckBoxOutlinedIcon from '@material-ui/icons/CheckBoxOutlined';

const useStyles = makeStyles(theme => ({
    choiceGrid: {
        justifyContent: "center",
        padding: [["0px", theme.spacing(2)]],
    },
}));
export default function DayPage({roleCount, infoMessages, ...props}) {
    const classes = useStyles(props);
    const {socket, serverMessage} = useContext(WebSocketContext)

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

    const newPlayersNotVoted = serverMessage['players_not_voted']
    const [playersNotVoted, setPlayersNotVoted] = useState(newPlayersNotVoted);
    useEffect(
        () => {
            if (newPlayersNotVoted != null) setPlayersNotVoted(newPlayersNotVoted);
        },
        [newPlayersNotVoted]
    )

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
            <Grid item xs={12}>
                <Typography>
                    You cannot change your vote after you submit!
                </Typography>
            </Grid>
            <Grid item xs={12} className={classes.choiceGrid}>
                <RadioChoice
                    choices={choices}
                    onSubmit={sendChoice}
                    onChange={setSelectedChoice}
                    default={defaultChoice}
                    disabledChoices={disabledChoices}
                    disableAll={disableChoices}
                    specialChoiceLabels={getSpecialLabels(
                        choices,
                        playerLabels,
                        playersNotVoted,
                        disableChoices,
                    )}
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
    roleCount: PropTypes.object,
    infoMessages: PropTypes.arrayOf(PropTypes.string),
}

DayPage.defaultProps = {}

function getSpecialLabels(players, playerLabels, playersNotVoted, showVoted) {
    const specialLabels = {}
    players.forEach(playerName => {
        const label = playerLabels && playerLabels[playerName];
        specialLabels[playerName] =
            <Grid container justify="space-between" alignItems="center">
                {showVoted &&
                <Grid item xs={1}>{/*empty*/}</Grid>
                }
                <Grid container item xs={showVoted ? 10 : 12} justify={"center"} alignItems={"center"}>
                    <Grid item>
                        {playerName + ((label != null && label !== "shielded") ? ` (${capitalize(label)})` : "")}
                    </Grid>
                    {(label === "shielded") &&
                    <Grid item>
                        <Tooltip title={"Shielded by the Sentinel"} arrow>
                            <SecurityIcon/>
                        </Tooltip>
                    </Grid>
                    }
                </Grid>
                {showVoted &&
                <Grid item xs={1}>
                    <Tooltip title={"Voted"} arrow>
                        {(playersNotVoted.includes(playerName)) ?
                            <CheckBoxOutlineBlankOutlinedIcon fontSize={"large"}/> :
                            <CheckBoxOutlinedIcon fontSize={"large"}/>
                        }
                    </Tooltip>
                </Grid>
                }
            </Grid>
    })
    return specialLabels;
}
