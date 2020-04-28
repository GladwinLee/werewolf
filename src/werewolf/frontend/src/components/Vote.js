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
        this.props.vote(p);
    }

    render() {
        if (this.state.vote) return <div>You voted {this.state.vote}</div>;

        const vote_choices = this.props.players.slice();
        const i = vote_choices.indexOf(this.props.name)
        if (i > -1) {
            vote_choices.splice(i, 1);
        }

        return (
            <ChoosePlayer
                choices={vote_choices}
                choiceType={"vote"}
                onChoice={(p) => this.onVote(p)}
            >
                Vote
            </ChoosePlayer>
        );
    }
}

export default Vote;