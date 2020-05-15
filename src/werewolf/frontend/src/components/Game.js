import React, {Component} from 'react';
import GameSetup from './GameSetup'
import PlayerList from './PlayerList';
import GameInfo from "./GameInfo";
import GameAction from "./GameAction";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import RoleCount from "./RoleCount";

class Game extends Component {
    constructor(props) {
        super(props);
        this.state = this.getInitialState();
    }

    getInitialState() {
        return {
            player_name: "",
            players: [],
            player_role: "",
            known_roles: {},
            show_game_setup: true,
            is_game_master: false,
            winner: "",
            vote_results: {},
            role_count: null,
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
                if (!this.state.player_name) return;
                this.setState({
                    known_roles: data['known_roles'],
                    role_count: data['role_count']
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
                    known_roles: data['known_roles'],
                });
                break;
            case 'worker.players_not_voted_list_change':
                // todo
                break;
            case 'worker.reset':
                this.setState(this.getInitialState());
                break;
            case 'worker.game_master':
                this.setState({is_game_master: true});
                break;
            default:
                console.log(data);
        }
    }

    nameSubmit(name) {
        this.setState({"player_name": name});
        this.socket.send(JSON.stringify({
            'type': "name_select",
            'name': name,
        }));
    }

    resetSubmit() {
        this.socket.send(JSON.stringify({
            'type': "reset",
        }));
    }

    startSubmit(roles) {
        this.socket.send(JSON.stringify({
            'type': "start",
            'roles': roles,
        }));
    }

    render() {
        return (
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Typography variant="h3">One-Night Werewolf</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper style={{height: "100%"}}>
                        <GameSetup
                            nameSubmit={(n) => this.nameSubmit(n)}
                            handleStart={(r) => this.startSubmit(r)}
                            visible={this.state.show_game_setup}
                            isGameMaster={this.state.is_game_master}
                        />
                        <GameAction
                            socket={this.socket}
                            actionData={this.state.actionData}
                            name={this.state.player_name}
                            players={this.state.players}
                        />
                    </Paper>
                </Grid>
                <Grid item xs={12} md={2}>
                    <GameInfo
                        name={this.state.player_name}
                        role={this.state.known_roles[this.state.player_name]}
                        winner={this.state.winner}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <PlayerList
                        players={this.state.players}
                        vote_results={this.state.vote_results}
                        known_roles={this.state.known_roles}
                    />
                </Grid>
                <Grid item>
                    <RoleCount roleCount={this.state.role_count}/>
                </Grid>
                <Button onClick={() => this.resetSubmit()}>Reset</Button>
            </Grid>
        )
    }
}

export default Game;