import React, {Component} from 'react'

class RoomSelector extends Component {
    constructor(props) {
        super(props);
        this.state = {value: ""};
    }

    handleChange(e) {
        this.setState({value: e.target.value});
    }

    render() {
        return (
            <form onSubmit={() => this.props.handleSubmit(this.state.value)}>
                <label>
                    Name:
                    <input
                        type="text"
                        id="room-selector"
                        value={this.state.value}
                        onChange={(e) => this.handleChange(e)}
                    />
                </label>
                <input type="submit" value="Enter Name"/>
            </form>
        )
    }
}

export default RoomSelector;