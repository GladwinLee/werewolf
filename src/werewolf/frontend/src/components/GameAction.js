import React, {Component} from 'react';
import Choice from "./ActionChoice";
import Timer from "./Timer";
import Typography from "@material-ui/core/Typography";
import capitalize from "@material-ui/core/utils/capitalize";
import CheckboxListSubmit from "./CheckboxListSubmit";

class GameAction extends Component {
    constructor(props) {
        super(props)
        this.state = {
            lastActionSent: "",
        }
    }

    onChoice(choice, action_type) {
        this.props.socket.send(JSON.stringify({
            'type': "action",
            'action_type': action_type,
            'choice': choice,
        }));
        this.setState({
            lastActionSent: action_type,
        });
        this.props.logAction(`${capitalize(action_type)} on: ${choice}`);
    }

    onCheckBoxSubmit(choices, action_type) {
        const selectedChoices = Object.keys(choices).filter(
            (choice) => choices[choice]);
        const choice = selectedChoices.join(";");
        this.onChoice(choice, action_type);
    }

    getDisplay(actionData) {
        if (!actionData || this.state.lastActionSent
            === actionData['action']) {
            return null;
        }

        let display;
        if (actionData['action'] === 'wait') {
            display =
                <Typography variant="h4">
                    {"Waiting on " + capitalize(actionData['waiting_on'])}
                </Typography>
        } else if (actionData['choice_type'] === "pick2") {
            display =
                <CheckboxListSubmit
                    choices={actionData['choices']}
                    onSubmit={(c) => this.onCheckBoxSubmit(c,
                        actionData['action'])}
                    minChoice={2}
                    maxChoice={2}
                    autoSubmitAfter={actionData['wait_time']}
                />
        } else if (actionData['choice_type'] === "pick1") {
            display =
                <Choice
                    choices={actionData['choices']}
                    choiceType={capitalize(actionData['action'])}
                    onChoice={(c) => this.onChoice(c, actionData['action'])}
                />
        }

        return display;
    }

    render() {
        const actionData = this.props.actionData;
        const waitTime = (actionData) ? actionData['wait_time'] : 0;

        return <div>
            <Timer start={waitTime} timerKey={actionData}/>
            {this.getDisplay(actionData)}
        </div>
    }
}

export default GameAction;