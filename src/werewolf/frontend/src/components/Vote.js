import React, {Component} from 'react';
import ActionChoice from "./ActionChoice";

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
            <ActionChoice
                choices={this.props.players}
                choiceType={"Vote"}
                onChoice={(p) => this.onVote(p)}
            />
        );
    }
}

export default Vote;