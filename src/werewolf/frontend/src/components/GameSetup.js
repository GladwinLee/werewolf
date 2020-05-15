import React, {Component} from 'react';
import {NameInput} from "./NameInput";
import GameSetupMaster from "./GameSetupMaster";

class GameSetup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show_name_input: true,
        }
    }

    nameSubmit(name) {
        this.props.nameSubmit(name);
        this.setState({show_name_input: false});
    }

    render() {
        if (!this.props.visible) return null;

        let name_display;
        if (this.state.show_name_input) name_display = <NameInput onSubmit={(name) => this.nameSubmit(name)} />
        let game_master_display;
        if (this.props.isGameMaster) game_master_display = <GameSetupMaster handleStart={this.props.handleStart} />

        return (
            <div>
                {name_display}
                {game_master_display}
            </div>
        )
    }
}

export default GameSetup;