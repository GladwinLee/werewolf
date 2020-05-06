import React, {Component} from 'react';
import Vote from "./Vote";
import ActionChoice from "./ActionChoice";

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
        this.setState({lastActionSent: action_type});
    }

    render() {
        if (!this.props.actionData || this.state.lastActionSent === this.props.actionData['action']) return null;
        let display;

        const actionData = this.props.actionData;
        if (actionData['action'] === 'wait') {
            display = <h1>{"Waiting on " + this.props.actionData['waiting_on']}</h1>
        } else {
            display = <ActionChoice
                choices={actionData['choices']}
                choiceType={actionData['action']}
                onChoice={(c) => this.onChoice(c, actionData['action'])}
            >
                {actionData['action']}
            </ActionChoice>
        }
        return display;
    }
}
export default GameAction;