import React, {Component} from 'react';

class   GameSetup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            show_name_input: true,
            show_start_button: false,
        }
    }

    handleChange(e) {
        this.setState({name: e.target.value});
    }

    nameSubmit() {
        if (this.state.name === "") {
            alert("Name can't be empty")
            return;
        }
        this.props.nameSubmit(this.state.name);
        this.setState({show_name_input: false, show_start_button: true});
    }

    render() {
        if (!this.props.visible) return null;

        let name_display;
        if (this.state.show_name_input) {
            name_display = <NameInput
                value={this.state.name}
                handleChange={(e) => this.handleChange(e)}
                onSubmit={() => this.nameSubmit()}
            />
        }

        let start_button_display;
        if (this.state.show_start_button) {
            start_button_display = <button onClick={this.props.onStart}>Start</button>
        }

        return (
            <div>
                {name_display}
                {start_button_display}
            </div>
        )
    }
}

function NameInput(props) {
    return (
        <div>
            <input
                id="chat-message-input" type="text"
                onKeyPress={(e) => e.key === "Enter" ? props.onSubmit() : null}
                onChange={props.handleChange}
                value={props.value}
            />
            <br/>
            <button onClick={props.onSubmit}>Choose name</button>
        </div>
    );
}

export default GameSetup;