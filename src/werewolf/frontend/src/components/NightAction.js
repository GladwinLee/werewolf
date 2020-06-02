import React, {useContext, useEffect, useState} from 'react';
import Timer from "./Timer";
import Typography from "@material-ui/core/Typography";
import capitalize from "@material-ui/core/utils/capitalize";
import CheckboxListSubmit from "./CheckboxListSubmit";
import RadioChoice from "./RadioChoice";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import makeStyles from "@material-ui/core/styles/makeStyles";
import WebSocketContext from "./WebSocketContext";

const useStyles = makeStyles(theme => ({
    choiceGrid: {
        justifyContent: "center",
        padding: [["0px", theme.spacing(2)]],
    },
}));

export default function NightAction({action, waitTime: propsWaitTime, ...props}) {
    const {socket, serverMessage} = useContext(WebSocketContext)

    const classes = useStyles(props);
    let {
        choices,
        disabledChoices,
        default: defaultChoice,
        choice_type: choiceType,
        help_text: helpText,
    } = serverMessage;
    if (!disabledChoices) disabledChoices = {};

    const [selectedChoices, setSelectedChoices] = useState();
    useEffect(() => {
        setSelectedChoices(defaultChoice);
    }, [defaultChoice])

    const [waitTime, setWaitTime] = useState(propsWaitTime);
    useEffect(() => {
            if (!propsWaitTime || propsWaitTime === waitTime) return;
            setWaitTime(propsWaitTime);
        }, [propsWaitTime]
    )

    const sendChoice = (choice) => {
        socket.send(JSON.stringify({
            'type': "action",
            'action_type': action,
            'choice': choice,
        }));
    }

    const onChoiceSubmit = () => sendChoice(selectedChoices);
    const onCheckBoxSubmit = () => {
        if (selectedChoices == null) return sendChoice("None");
        const choicesString = Object.keys(selectedChoices).filter(
            (choice) => selectedChoices[choice]
        ).join(";");
        sendChoice(choicesString);
    }

    let actionDisplay;
    let onSubmit = () => {};
    if (choiceType === "pick2") {
        onSubmit = onCheckBoxSubmit;
        actionDisplay =
            <CheckboxListSubmit
                choices={choices}
                onChange={(c) => setSelectedChoices(c)}
                minChoice={2}
                maxChoice={2}
                disabledChoices={disabledChoices}
                noAboveMax
            />
    } else if (choiceType === "pick1") {
        onSubmit = onChoiceSubmit;
        let onChange = setSelectedChoices;
        if (action === "witch") onChange = (c) => {
            setSelectedChoices(c);
            sendChoice(c);
        }
        actionDisplay =
            <RadioChoice
                choices={choices}
                onChange={onChange}
                default={defaultChoice}
                disabledChoices={disabledChoices}
            />
    }

    const onAutoSubmit = () => {
        if (action === "witch") sendChoice(defaultChoice);
        else onSubmit();
    }

    return <>
        <Grid item xs={12}>
            <ActionLabel action={action} helpText={helpText}/>
        </Grid>
        <Grid item xs={12} className={classes.choiceGrid}>
            {actionDisplay}
        </Grid>
        <Grid item xs={12}>
            <Timer
                start={waitTime}
                timerKey={getTimerKey(action)}
                callback={onAutoSubmit}
            />
        </Grid>
    </>
}

NightAction.propTypes = {
    action: PropTypes.string,
    waitTime: PropTypes.number,
    serverMessage: PropTypes.object,
    socket: PropTypes.object,
}

NightAction.defaultProps = {}

function getTimerKey(action) {
    if (action === "witch_part_two") return "witch";
    return action;
}

function ActionLabel({action, helpText}) {
    if (action === "witch_part_two") action = "witch";
    return <div>
        <Typography variant="h3">
            {(action) ? capitalize(action) : null}
        </Typography>
        <Typography variant="h5">{helpText}</Typography>
    </div>

}