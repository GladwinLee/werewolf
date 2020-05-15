import React, {Component} from 'react';
import {NameInput} from "./NameInput";
import GameSetupMaster from "./GameSetupMaster";
import Paper from "@material-ui/core/Paper";

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
        if (this.state.show_name_input) {
            name_display = <NameInput
                onSubmit={(name) => this.nameSubmit(name)}
            />
        }

        let game_master_display;
        if (this.props.isGameMaster) {
            game_master_display = <GameSetupMaster
                onStart={this.props.onStart}
            />
        }

        return (
            <Paper>
                {name_display}
                {game_master_display}
            </Paper>
        )
    }
}

export default GameSetup;