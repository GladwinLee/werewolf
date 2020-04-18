import React, {Component} from 'react';

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
        if (!this.props.visible) return null;
        if (this.state.vote) return <div>You voted {this.state.vote}</div>

        const vote_choices = this.props.players.slice();
        const i = vote_choices.indexOf(this.props.name)
        if (i > -1) {
            vote_choices.splice(i, 1);
        }
        const players = vote_choices.map((p) => {
            return (
                <li key={"vote-" + p}>
                    <button onClick={() => this.onVote(p)}>{p}</button>
                </li>
            )
        });
        return (
            <div>
                Vote
                <ul>
                    {players}
                </ul>
            </div>
        );
    }
}

export default Vote;