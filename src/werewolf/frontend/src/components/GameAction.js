import React, {useState} from 'react';
import Timer from "./Timer";
import Typography from "@material-ui/core/Typography";
import capitalize from "@material-ui/core/utils/capitalize";
import CheckboxListSubmit from "./CheckboxListSubmit";
import RadioChoice from "./RadioChoice";

export default function GameAction(props) {
    const [lastActionSent, setLastActionSent] = useState("");
    const [choices, setChoices] = useState();

    const actionData = props.actionData;
    if (!actionData || lastActionSent === actionData['action']) {
        return null;
    }

    const sendChoice = (choice, action_type) => {
        console.log(`${choice} chosen`)
        props.socket.send(JSON.stringify({
            'type': "action",
            'action_type': action_type,
            'choice': choice,
        }));
        setLastActionSent(action_type);
        props.logAction(`${capitalize(action_type)} on: ${choice}`);
    }

    const onCheckBoxSubmit = (action_type) => {
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
    if (actionData['action'] === 'wait') {
        display =
            <Typography variant="h4">
                {"Waiting on " + capitalize(actionData['waiting_on'])}
            </Typography>
    } else if (actionData['action'] === "witch") {

    } else if (actionData['choice_type'] === "pick2") {
        onSubmit = () => onCheckBoxSubmit(actionData['action']);
        display =
            <CheckboxListSubmit
                choices={actionData['choices']}
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
                label={capitalize(actionData['action'])}
                onSubmit={onSubmit}
                onChange={(c) => setChoices(c)}
                default={actionData['default']}
            />
    }

    const waitTime = (actionData['wait_time']) ? actionData['wait_time'] : 0;

    let timerKey = actionData['action'];
    if (actionData['action'] === "wait") {
        timerKey += `-${actionData['waiting_on']}`;
    }

    return <div>
        <Timer
            start={waitTime}
            timerKey={timerKey}
            callback={() => onSubmit()}
        />
        {display}
    </div>
}
