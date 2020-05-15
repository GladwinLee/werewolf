import React, {Component} from 'react';
import ActionChoice from "./ActionChoice";
import Timer from "./Timer";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import capitalize from "@material-ui/core/utils/capitalize";
import CheckboxList from "./CheckboxList";

class GameAction extends Component {
    constructor(props) {
        super(props)
        this.state = {
            lastActionSent: "",
            timeLeft: 0
        }
    }

    onChoice(choice, action_type) {
        this.props.socket.send(JSON.stringify({
            'type': "action",
            'action_type': action_type,
            'choice': choice,
        }));
        this.setState({lastActionSent: action_type});
    }

    onCheckBoxSubmit(choices, action_type) {
        const selectedChoices = Object.keys(choices).filter((choice) => choices[choice]);
        const choice = selectedChoices.join(";");

        this.props.socket.send(JSON.stringify({
            'type': "action",
            'action_type': action_type,
            'choice': choice,
        }));
        this.setState({lastActionSent: action_type});
    }

    render() {
        if (!this.props.actionData || this.state.lastActionSent === this.props.actionData['action']) return null;
        let display;

        const actionData = this.props.actionData;
        if (actionData['action'] === 'wait') {
            display = <Typography variant="h4">{"Waiting on " + capitalize(this.props.actionData['waiting_on'])}</Typography>
        } else if (actionData['choice_type'] === "pick2") {
            display =
                <CheckboxList
                    choices={actionData['choices']}
                    onSubmit={(c) => this.onCheckBoxSubmit(c, actionData['action'])}
                    minChoice={2}
                    maxChoice={2}
                />
        } else if (actionData['choice_type'] === "pick1") {
            display =
                <div>
                    <Timer start={actionData['role_wait_time']}/>
                    <ActionChoice
                        choices={actionData['choices']}
                        choiceType={capitalize(actionData['action'])}
                        onChoice={(c) => this.onChoice(c, actionData['action'])}
                    />
                </div>
        }
        return <div>{display}</div>;
    }
}

export default GameAction;