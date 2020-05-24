import React, {Component} from 'react';
import GameSetup from './GameSetup'
import PlayersInfo from './PlayersInfo';
import GameInfo from "./GameInfo";
import GameAction from "./GameAction";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import RoleInfo from "./RoleInfo";
import ActionLog from "./ActionLog";
import {CookiesProvider} from "react-cookie";
import capitalize from "@material-ui/core/utils/capitalize";
import Link from "@material-ui/core/Link";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

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
            players_status: {},
            known_roles: {},
            show_game_setup: true,
            is_game_master: false,
            winner: "",
            vote_results: {},
            role_info: null,
            action_log: [],
            configurable_roles: [],
        }
    }

    componentDidMount() {
        this.socket = new WebSocket(
            'ws://' + window.location.host + "/ws/werewolf/"
            + this.props.roomName + "/"
        );

        this.socket.onmessage = (e) => {
            this.receiveMessage(JSON.parse(e.data));
        };

        this.socket.onclose = () => {
            console.error('socket closed unexpectedly');
        };
    }

    receiveMessage(data) {
        console.log("Received message " + data.type)
        console.log(data);

        const logRevealedRoles = (revealedRoles) => {
            let logMsg = "Changed Roles:";
            Object.entries(revealedRoles).forEach(
                ([player_name, role]) => {
                    logMsg += `\n${player_name}: ${capitalize(role)}`;
                });
            this.addToActionLog(logMsg);
        }

        switch (data.type) {
            case 'worker.player_list_change':
                this.setState({players: data['player_list']});
                break;
            case 'worker.start':
                this.setState({show_game_setup: false});
                if (!this.state.player_name) {
                    return;
                }
                this.addToActionLog(
                    `Your role: ${capitalize(
                        data['known_roles'][this.state.player_name])}`
                );
                this.setState({
                    known_roles: data['known_roles'],
                    role_info: data['role_info']
                })
                if (Object.entries(data['known_roles']).length > 1) {
                    let logMsg = "Known allies:";
                    Object.entries(data['known_roles']).forEach(
                        ([player_name, role]) => {
                            if (player_name === this.state.player_name) {
                                return;
                            }
                            logMsg += `\n${player_name}: ${capitalize(role)}`
                        });
                    this.addToActionLog(logMsg);
                }
                break;
            case 'worker.game_master':
                this.setState({
                    is_game_master: true,
                    configurable_roles: data['configurable_roles'],
                });
                break;
            case 'action':
                this.setState({
                    action_data: data
                });
                break;
            case 'role_special':
                switch (data["result_type"]) {
                    case "witch":
                    case "role_for_all":
                    case "role": {
                        const newKnownRoles = {...this.state.known_roles, ...data['result']}
                        logRevealedRoles(data['result']);
                        this.setState({known_roles: newKnownRoles});
                        break;
                    }
                    case "sentinel": {
                        const protectedPlayer = data['result'];
                        const newStatus = {...this.state.players_status};
                        newStatus[protectedPlayer] = "sentinel"
                        this.setState({players_status: newStatus});
                        this.addToActionLog(
                            `The Sentinel protects ${protectedPlayer}`);
                        break;
                    }
                }
                break;
            case 'worker.winner':
                this.setState({
                    winner: data['winner'],
                    vote_results: data['vote_results'],
                    known_roles: data['known_roles'],
                    action_log: data['action_log'],
                    action_data: {},
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
        if (this.state.players.includes(name)) {
            return false;
        }
        this.setState({"player_name": name});
        this.socket.send(JSON.stringify({
            'type': "name_select",
            'name': name,
        }));
        return true;
    }

    resetSubmit() {
        this.socket.send(JSON.stringify({
            'type': "reset",
        }));
    }

    startSubmit(settings) {
        this.socket.send(JSON.stringify({
            'type': "start",
            'settings': settings,
        }));
    }

    addToActionLog(log) {
        const newActionLog = this.state.action_log.slice();
        newActionLog.push(log);
        this.setState({action_log: newActionLog})
    }

    render() {
        return (
            <CookiesProvider>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Typography variant="h3">One-Night Werewolf</Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Paper style={{height: "100%"}}>
                            <GameSetup
                                nameSubmit={(n) => this.nameSubmit(n)}
                                handleStart={(s) => this.startSubmit(s)}
                                visible={this.state.show_game_setup}
                                isGameMaster={this.state.is_game_master}
                                configurableRoles={this.state.configurable_roles}
                                numPlayers={this.state.players.length}
                            />
                            <GameAction
                                socket={this.socket}
                                actionData={this.state.action_data}
                                name={this.state.player_name}
                                players={this.state.players}
                                logAction={(l) => this.addToActionLog(l)}
                            />
                        </Paper>
                    </Grid>
                    <Grid container item xs={12} md={5} spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Paper style={{height: "100%"}}>
                                <GameInfo
                                    name={this.state.player_name}
                                    role={this.state.known_roles[this.state.player_name]}
                                    winner={this.state.winner}
                                />
                            </Paper>
                        </Grid>
                        <Grid container item xs={12} md={6} spacing={3}
                              direction={'column'}>
                            <Grid item>
                                <Paper style={{width: "100%"}}>
                                    <RoleInfo roleInfo={this.state.role_info}/>
                                </Paper>
                            </Grid>
                            <Grid item>
                                <Paper style={{width: "100%"}}>
                                    <ActionLog
                                        actionLog={this.state.action_log}/>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Paper style={{height: "100%"}}>
                            <PlayersInfo
                                players={this.state.players}
                                vote_results={this.state.vote_results}
                                known_roles={this.state.known_roles}
                                status={this.state.players_status}
                            />
                        </Paper>
                    </Grid>
                    <Grid item xs={6}>
                        <ExpansionPanel>
                            <ExpansionPanelSummary
                                expandIcon={<ExpandMoreIcon/>}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography>Rules</Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                                <Typography style={{whiteSpace: 'pre-line'}}>
                                    {rules}
                                    <Link
                                        href={"https://www.fgbradleys.com/rules/rules2/OneNightUltimateWerewolf-rules.pdf"}>
                                        (Full Rules)
                                    </Link>
                                    <Link
                                        href={"https://cdn.shopify.com/s/files/1/0740/4855/files/Daybreak_rules_for_BGG.pdf?338"}>
                                        -(Daybreak Rules)
                                    </Link>
                                </Typography>
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                    </Grid>
                    <Button onClick={() => this.resetSubmit()}>Reset</Button>
                </Grid>
            </CookiesProvider>
        )
    }
}

const rules = "Players are assigned a role at the start of the game. The game starts at night. "
    + "Some special roles will have actions during the night, in a specific order. "
    + "After the night ends, everyone votes to kill someone. "
    + "\nIf there is a tie, all of the highest voted will "
    + "be killed except in the case where every player received 1 vote. In that case, no one is killed."
    + "\nThe Village wins if: "
    + "\n  - a Werewolf is killed"
    + "\n  - they vote not to kill anyone when there are no Werewolf players. "
    + "\nThe Tanner wins if they die. "
    + "\nThe Werewolves win otherwise. \n"

export default Game;