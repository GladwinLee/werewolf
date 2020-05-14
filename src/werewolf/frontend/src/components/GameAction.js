import React, {Component} from 'react';
import ActionChoice from "./ActionChoice";
import Timer from "./Timer";
import Typography from "@material-ui/core/Typography";

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

    render() {
        if (!this.props.actionData || this.state.lastActionSent === this.props.actionData['action']) return null;
        let display;

        const actionData = this.props.actionData;
        if (actionData['action'] === 'wait') {
            display = <Typography variant="h4">{"Waiting on " + this.props.actionData['waiting_on']}</Typography>
        } else {
            display =
                <div>
                    <Timer start={actionData['role_wait_time']}/>
                    <ActionChoice
                        choices={actionData['choices']}
                        choiceType={actionData['action']}
                        onChoice={(c) => this.onChoice(c, actionData['action'])}
                    >
                        {actionData['action']}
                    </ActionChoice>
                </div>
        }
        return display;
    }
}

export default GameAction;