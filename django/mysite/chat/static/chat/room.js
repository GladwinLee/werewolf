const roomName = JSON.parse(document.getElementById('room-name').textContent);

const chatSocket = new WebSocket(
    'ws://'
    + window.location.host
    + '/ws/chat/'
    + roomName + '/'
);

function PlayerList(props) {
    const players = props.players.map((p) => {
        return (
            <li key={p}>
                {p}
            </li>
        )
    });
    return (
        <div>
            Players
            <ul>
                {players}
            </ul>
        </div>
    );
}

function NameInput(props) {
    return (
        <div>
            <input
                id="chat-message-input" type="text" size="100"
                onKeyPress={(e) => e.key === "Enter" ? props.onSubmit() : null}
                onChange={props.handleChange}
                value={props.value}
            />
            <br/>
            <input
                id="chat-message-submit"
                type="button"
                value="Choose name"
                onClick={props.onSubmit}
            />
        </div>
    );
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            show_name_input: true,
            players: [],
        };

        chatSocket.onmessage = (e) => {
            const data = JSON.parse(e.data);
            console.log(data)
            switch (data.type) {
                case 'player_list_change':
                    this.setState({players: data['message']});
                    break;
                default:
                    alert(data['message']);
            }
        };

        chatSocket.onclose = (e) => {
            console.error('Chat socket closed unexpectedly');
        };
    }

    handleChange(e) {
        this.setState({name: e.target.value});
    }

    nameSubmit() {
        chatSocket.send(JSON.stringify({
            'type': "name_select",
            'message': this.state.name,
        }));
        this.setState({show_name_input: false});
    }

    render() {
        let name_display;
        if (this.state.show_name_input) {
            name_display = <NameInput
                value={this.state.name}
                handleChange={(e) => this.handleChange(e)}
                onSubmit={() => this.nameSubmit()}
            />
        } else {
            name_display = <div>Name: {this.state.name}</div>
        }

        return (
            <div>
                <PlayerList players={this.state.players}/>
                {name_display}
            </div>
        )
    }
}

ReactDOM.render(<Game/>, document.getElementById('root'));
document.querySelector('#chat-message-input').focus();