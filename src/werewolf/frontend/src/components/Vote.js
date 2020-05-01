import React, {Component} from 'react';
import ChoosePlayer from "./ChoosePlayer";

class Vote extends Component {
    constructor(props) {
        super(props)
        this.state = {
            "vote": "",
        }
    }

    onVote(p) {
        this.setState({"vote": p});
        this.props.onVote(p);
    }

    render() {
        if (this.state.vote) return <div>You voted {this.state.vote}</div>;
        return (
            <ChoosePlayer
                choices={this.props.players}
                choiceType={"vote"}
                onChoice={(p) => this.onVote(p)}
            >
                Vote
            </ChoosePlayer>
        );
    }
}

export default Vote;