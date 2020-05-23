import React, {useEffect, useState} from 'react';
import Timer from "./Timer";
import Typography from "@material-ui/core/Typography";
import capitalize from "@material-ui/core/utils/capitalize";
import CheckboxListSubmit from "./CheckboxListSubmit";
import RadioChoice from "./RadioChoice";
import PropTypes from "prop-types";

export default function GameAction(props) {
    const [lastActionSent, setLastActionSent] = useState("");
    const [choices, setChoices] = useState();
    const [waitTime, setWaitTime] = useState(0);
    const [timerKey, setTimerKey] = useState("");

    const actionData = props.actionData;

    useEffect(() => {
        setChoices(actionData['default']);
    }, [actionData])

    const sendChoice = (choice, action_type) => {
        if (lastActionSent === action_type) {
            return;
        }
        props.socket.send(JSON.stringify({
            'type': "action",
            'action_type': action_type,
            'choice': choice,
        }));
        setLastActionSent(action_type);
        props.logAction(`${capitalize(action_type)} on: ${choice}`);
    }

    const onCheckBoxSubmit = (action_type) => {
        if (choices == null) {
            return sendChoice("None", action_type);
        }
        const choicesString = Object.keys(choices).filter(
            (choice) => choices[choice]
        ).join(";");
        sendChoice(choicesString, action_type);
    }

    const onChoiceSubmit = (action_type) => {
        sendChoice(choices, action_type);
    }

    let display;
    let onSubmit = () => {
    };

    const getDisplayAndOnSubmit = () => {
        if (actionData['action'] === 'wait') {
            display =
                <Typography variant="h4">
                    {"Waiting on " + capitalize(actionData['waiting_on'])}
                </Typography>
        } else if (actionData['choice_type'] === "pick2") {
            onSubmit = () => onCheckBoxSubmit(actionData['action']);
            display =
                <CheckboxListSubmit
                    choices={actionData['choices']}
                    label={getLabel(actionData)}
                    onSubmit={onSubmit}
                    onChange={(c) => setChoices(c)}
                    minChoice={2}
                    maxChoice={2}
                />
        } else if (actionData['choice_type'] === "pick1") {
            onSubmit = () => onChoiceSubmit(actionData['action'])
            display =
                <RadioChoice
                    choices={actionData['choices']}
                    label={getLabel(actionData)}
                    onSubmit={onSubmit}
                    onChange={(c) => setChoices(c)}
                    default={actionData['default']}
                />
        }
    }

    if (lastActionSent !== actionData['action']) {
        getDisplayAndOnSubmit()
    }

    const onAutoSubmit = () => {
        if (actionData['action'] === "witch") {
            sendChoice(actionData['default'], actionData['action'])
        } else {
            onSubmit()
        }
    }

    if (actionData['wait_time']
        && actionData['wait_time'] !== waitTime
        && actionData['wait_time'] !== "continue"
    ) {
        setWaitTime(actionData['wait_time']);
    }

    let newTimerKey = actionData['action'];
    if (actionData['action'] === "wait") {
        newTimerKey += `-${actionData['waiting_on']}`;
    } else if (actionData['action'] === "witch_part_two") {
        newTimerKey = "witch"
    }
    if (newTimerKey !== timerKey) {
        setTimerKey(newTimerKey);
    }

    return <div>
        <Timer
            start={waitTime}
            timerKey={timerKey}
            callback={onAutoSubmit}
        />
        {display}
    </div>
}

GameAction.propTypes = {
    actionData: PropTypes.object,
    socket: PropTypes.object,
    logAction: PropTypes.func,
}

GameAction.defaultProps = {
    actionData: {},
}

function getLabel(actionData) {
    let title = actionData['action'];
    if (title === "witch_part_two") {
        title = "witch";
    }
    let subtitle = actionData['help_text'];

    return <div>
        <Typography variant="h4">{capitalize(title)}</Typography>
        <Typography variant="subtitle1">{subtitle}</Typography>
    </div>

}