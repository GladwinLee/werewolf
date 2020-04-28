import React, {Component} from 'react';
import Vote from "./Vote";

class GameAction extends Component {
    constructor(props) {
        super(props)
    }

    voteSubmit(vote) {
        this.props.socket.send(JSON.stringify({
            'type': "vote",
            'vote': vote,
        }));
        this.setState({show_vote_input: false});
    }

    render() {
        let display;
        switch (this.props.action) {
            case 'vote':
                display = <Vote
                    vote={(v) => this.voteSubmit(v)}
                    name={this.props.name}
                    players={this.props.players}
                />;
                break;
            default:
                display = null;
        }

        return display;
    }
}

export default GameAction;