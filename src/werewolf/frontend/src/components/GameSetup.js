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
        const success = this.props.nameSubmit(name);
        if (success) {
            this.setState({show_name_input: false});
        }
        return success;
    }

    render() {
        if (!this.props.visible) {
            return null;
        }

        let name_display = (this.state.show_name_input) ?
            <NameInput onSubmit={(name) => this.nameSubmit(name)}/> :
            null

        let game_master_display = (this.props.isGameMaster) ?
            <GameSetupMaster
                handleStart={this.props.handleStart}
                configurableRoles={this.props.configurableRoles}
            /> :
            null

        return (
            <div>
                {name_display}
                {game_master_display}
            </div>
        )
    }
}

export default GameSetup;