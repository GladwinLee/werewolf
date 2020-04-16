const roomName = JSON.parse(document.getElementById('room-name').textContent);

const chatSocket = new WebSocket(
    'ws://'
    + window.location.host
    + '/ws/chat/'
    + roomName + '/'
);

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            players: [],
            show_vote_input: false,
            show_game_setup: true,
        };

        chatSocket.onmessage = (e) => {
            this.receiveMessage(JSON.parse(e.data));
        };

        chatSocket.onclose = (e) => {
            console.error('Chat socket closed unexpectedly');
        };
    }

    receiveMessage(data) {
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
                alert(data);
        }
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
        let name_display;
        if (this.state.name) name_display = <div>Name: {this.state.name}</div>
        return (
            <div>
                <PlayerList players={this.state.players}/>
                <GameSetup
                    nameSubmit={(n) => this.nameSubmit(n)}
                    onStart={() => this.startSubmit()}
                    visible={this.state.show_game_setup}
                />
                {name_display}
                <Vote
                    vote={(v) => this.voteSubmit(v)}
                    name={this.state.name}
                    players={this.state.players}
                    visible={this.state.show_vote_input}
                />
            </div>
        )
    }
}

function PlayerList(props) {
    const players = props.players.map((p) => {
        return <li key={p}>{p}</li>
    });
    return (
        <div>
            Connected Players
            <ul>
                {players}
            </ul>
        </div>
    );
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

class Vote extends React.Component {
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

ReactDOM.render(<Game/>, document.getElementById('root'));
document.querySelector('#chat-message-input').focus();