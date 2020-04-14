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

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            show_vote_input: false,
            show_game_setup: true,
            players: [],
        };

        chatSocket.onmessage = (e) => {
            const data = JSON.parse(e.data);
            // console.log(data)
            switch (data.type) {
                case 'player_list_change':
                    this.setState({players: data['message']});
                    break;
                case 'start':
                    this.setState({show_game_setup: false});
                    if (this.state.name) {
                        this.setState({show_vote_input: true});
                    }
                    break;
                default:
                    alert(data['message']);
            }
        };

        chatSocket.onclose = (e) => {
            console.error('Chat socket closed unexpectedly');
        };
    }

    nameSubmit(name) {
        this.state.name = name;
        chatSocket.send(JSON.stringify({
            'type': "name_select",
            'message': name,
        }));
    }

    startSubmit() {
        this.setState({show_game_setup: false, show_vote_input: true})
        chatSocket.send(JSON.stringify({
            'type': "start",
            'name': this.state.name,
        }));
    }

    voteSubmit(vote) {
        chatSocket.send(JSON.stringify({
            'type': "vote",
            'vote': vote,
        }));
        this.setState({show_vote_input: false});
    }

    render() {
        let vote_display;
        if (this.state.show_vote_input) {
            console.log(this.state);
            const vote_choices = this.state.players.slice();
            const i = vote_choices.indexOf(this.state.name)
            if (i > -1) {
                vote_choices.splice(i, 1);
            }
            console.log(vote_choices);
            vote_display = <Vote vote={(v) => this.voteSubmit(v)} players={vote_choices}/>
        }

        let setup_display;
        if (this.state.show_game_setup) {
            setup_display = <GameSetup
                nameSubmit={(n) => this.nameSubmit(n)}
                onStart={() => this.startSubmit()}
            />
        }

        return (
            <div>
                <PlayerList players={this.state.players}/>
                {setup_display}
                {vote_display}
            </div>
        )
    }
}

class GameSetup extends React.Component {
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
        this.props.nameSubmit(this.state.name);
        this.setState({show_name_input: false, show_start_button: true});
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

function Vote(props) {
    const players = props.players.map((p) => {
        return (
            <li key={"vote-" + p}>
                <button onClick={() => props.vote(p)}>{p}</button>
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

ReactDOM.render(<Game/>, document.getElementById('root'));
document.querySelector('#chat-message-input').focus();