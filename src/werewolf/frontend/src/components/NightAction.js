import React, {useEffect, useState} from 'react';
import Timer from "./Timer";
import Typography from "@material-ui/core/Typography";
import capitalize from "@material-ui/core/utils/capitalize";
import CheckboxListSubmit from "./CheckboxListSubmit";
import RadioChoice from "./RadioChoice";
import PropTypes from "prop-types";

export default function NightAction({action, waitTime: propsWaitTime, serverMessage, socket}) {
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

    let display;
    let onSubmit = () => {};
    if (choiceType === "pick2") {
        onSubmit = onCheckBoxSubmit;
        display =
            <CheckboxListSubmit
                choices={choices}
                onSubmit={onSubmit}
                onChange={(c) => setSelectedChoices(c)}
                minChoice={2}
                maxChoice={2}
                disabledChoices={disabledChoices}
            />
    } else if (choiceType === "pick1") {
        onSubmit = onChoiceSubmit;
        display =
            <RadioChoice
                choices={choices}
                onSubmit={onSubmit}
                onChange={(c) => setSelectedChoices(c)}
                default={defaultChoice}
                disabledChoices={disabledChoices}
            />
    }

    const onAutoSubmit = () => {
        if (action === "witch") sendChoice(defaultChoice);
        else onSubmit();
    }

    return <>
        <ActionLabel action={action} helpText={helpText}/>
        <Timer
            start={waitTime}
            timerKey={getTimerKey(action)}
            callback={onAutoSubmit}
        />
        {display}
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