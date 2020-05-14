import React, {Component} from 'react';
import Button from "@material-ui/core/Button";
import {NameInput} from "./NameInput";

class GameSetup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            show_name_input: true,
            show_start_button: false,
        }
    }

    nameSubmit(name) {
        this.props.nameSubmit(name);
        this.setState({show_name_input: false, show_start_button: true});
    }

    render() {
        if (!this.props.visible) return null;

        let name_display;
        if (this.state.show_name_input) {
            name_display = <NameInput
                onSubmit={(name) => this.nameSubmit(name)}
            />
        }

        let start_button_display;
        if (this.state.show_start_button) {
            start_button_display = <Button variant="contained" onClick={this.props.onStart}>Start</Button>
        }

        return (
            <div>
                {name_display}
                {start_button_display}
            </div>
        )
    }
}

export default GameSetup;