import React, {Component} from 'react';
import Vote from "./Vote";
import ChoosePlayer from "./ChoosePlayer";

class GameAction extends Component {
    constructor(props) {
        super(props)
    }

    onVote(vote) {
        this.props.socket.send(JSON.stringify({
            'type': "vote",
            'vote': vote,
        }));
        this.setState({show_vote_input: false});
    }

    onSeer(player) {
        this.props.socket.send(JSON.stringify({
            'type': "role_special",
            'role_special': 'seer',
            'player1': player,
        }));
        this.setState({show_vote_input: false});
    }

    render() {
        if (!this.props.actionData) return null;
        let display;
        switch (this.props.actionData['action']) {
            case 'vote':
                display = <Vote
                    onVote={(v) => this.onVote(v)}
                    players={getOtherPlayerNames(this.props.players, this.props.name)}
                />;
                break;
            case 'seer':
                display = <ChoosePlayer
                    choices={getOtherPlayerNames(this.props.players, this.props.name)}
                    choiceType="seer"
                    onChoice={(v) => this.onSeer(v)}
                >
                    Seer
                </ChoosePlayer>
                break;
            case 'wait':
                display = <h1>"Waiting on " + this.props.actionData['waiting_on']</h1>
                break;
        }

        return display;
    }
}

function getOtherPlayerNames(players, name) {
    const nameIndex = players.indexOf(name)
    if (nameIndex === -1) {
        console.error("getOtherPlayerNames called with name not in players");
        return;
    }
    const otherPlayers = players.slice();
    otherPlayers.splice(nameIndex, 1)
    return otherPlayers;
}

export default GameAction;