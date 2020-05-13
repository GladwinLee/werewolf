import React, {Component} from 'react';
import GameSetup from './GameSetup'
import PlayerList from './PlayerList';
import GameInfo from "./GameInfo";
import GameAction from "./GameAction";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";


class Game extends Component {
    constructor(props) {
        super(props);
        this.state = this.getInitialState();
    }

    getInitialState() {
        return {
            name: "",
            players: [],
            player_role: "",
            known_roles: {},
            show_game_setup: true,
            winner: "",
            vote_results: {},
        }
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
                    player_role: data['player_role'],
                    known_roles: data['known_roles'],
                })
                break;
            case 'worker.action':
                this.setState({
                    actionData: data
                });
                break;
            case 'worker.role_special':
                const new_known_roles = {...this.state.known_roles, ...data['result']}
                this.setState({known_roles: new_known_roles});
                break;
            case 'worker.winner':
                this.setState({
                    winner: data['winner'],
                    vote_results: data['vote_results'],
                    player_role: data['player_role'],
                    known_roles: data['known_roles'],
                });
                break;
            case 'worker.players_not_voted_list_change':
                // todo
                break;
            case 'worker.reset':
                this.setState(this.getInitialState());
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

    resetSubmit() {
        this.socket.send(JSON.stringify({
            'type': "reset",
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
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper>
                        <Typography variant="h3">One-night Werewolf</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={6}>
                    <Paper>
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
                            actionData={this.state.actionData}
                            name={this.state.name}
                            players={this.state.players}
                        />
                    </Paper>
                </Grid>
                <Grid item xs={6}>
                    <Paper>
                        <PlayerList
                            players={this.state.players}
                            vote_results={this.state.vote_results}
                            known_roles={this.state.known_roles}
                        />
                    </Paper>
                </Grid>
                <Button onClick={() => this.resetSubmit()}>Reset</Button>
            </Grid>
        )
    }
}

export default Game;