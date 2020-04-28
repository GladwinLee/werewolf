import React, {Component} from 'react';
import GameSetup from './GameSetup'
import PlayerList from './PlayerList';
import GameInfo from "./GameInfo";
import GameAction from "./GameAction";

class Game extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            players: [],
            player_role: "",
            known_roles: {},
            show_game_setup: true,
            winner: "",
            vote_result: {},
        };
    }

    componentDidMount() {
        this.socket = new WebSocket(
            'ws://' + window.location.host + "/ws/werewolf/" + this.props.roomName + "/"
        );

        this.socket.onmessage = (e) => {
            this.receiveMessage(JSON.parse(e.data));
        };

        this.socket.onclose = (e) => {
            console.error('socket closed unexpectedly');
        };
    }

    receiveMessage(data) {
        console.log("Received message " + data.type)
        console.log(data);
        switch (data.type) {
            case 'worker.player_list_change':
                this.setState({players: data['player_list']});
                break;
            case 'worker.start':
                this.setState({show_game_setup: false});
                if (!this.state.name) return;

                this.setState({
                    player_role:data['player_role'],
                    known_roles:data['known_roles'],
                })
                break;
            case 'worker.action':
                this.setState({
                    action:data['action']
                });
                break;
            case 'worker.winner':
                this.setState({
                    winner:data['winner'],
                    vote_result:data['vote_result'],
                    player_role:data['player_role'],
                    known_roles:data['known_roles'],
                });
                break;
            case 'worker.players_not_voted_list_change':
                // todo
                break;
            default:
                console.log(data);
        }
    }

    nameSubmit(name) {
        this.setState({"name": name});
        this.socket.send(JSON.stringify({
            'type': "name_select",
            'message': name,
        }));
    }

    startSubmit() {
        this.socket.send(JSON.stringify({
            'type': "start",
            'name': this.state.name,
        }));
    }

    render() {
        return (
            <div>
                Connected Players
                <PlayerList
                    players={this.state.players}
                    vote_result={this.state.vote_result}
                    known_roles={this.state.known_roles}
                />
                <GameSetup
                    nameSubmit={(n) => this.nameSubmit(n)}
                    onStart={() => this.startSubmit()}
                    visible={this.state.show_game_setup}
                />
                <GameInfo
                    name={this.state.name}
                    role={this.state.player_role}
                    winner={this.state.winner}
                />
                <GameAction
                    socket={this.socket}
                    action={this.state.action}
                    name={this.state.name}
                    players={this.state.players}
                />
            </div>
        )
    }
}

export default Game;