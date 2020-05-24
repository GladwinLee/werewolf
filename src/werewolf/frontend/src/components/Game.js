import React, {useEffect, useState} from 'react';
import Container from "@material-ui/core/Container";
import {TitleNameSelect} from "./TitleNameSelect";

export default function Game(props) {
    const [playerName, setPlayerName] = useState("")
    const [message, setMessage] = useState({});
    const [pageName, setPageName] = useState("TitleNameSelect");

    useEffect(
        () => {
            props.socket.onmessage = (e) => setMessage((JSON.parse(e.data)));
            props.socket.onclose = () => console.error(
                'socket closed unexpectedly');
        },
        []
    )

    useEffect(
        () => {
            console.log("received message")
            console.log(message)
        },
        [message]
    )

    const getPage = (pageName) => {
        switch (pageName) {
            case "TitleNameSelect":
                return <TitleNameSelect
                    onSubmit={setPlayerName}
                    playerList={["a,b"]}
                    socket={props.socket}
                />
        }
        return null;
    }
    return <Container maxWidth="lg">
        {getPage(pageName)}
    </Container>
}

// const getInitialState = () => {
//     return {
//         player_name: "",
//         players: [],
//         player_role: "",
//         players_status: {},
//         known_roles: {},
//         show_game_setup: true,
//         is_game_master: false,
//         winner: "",
//         vote_results: {},
//         role_info: null,
//         action_log: [],
//         configurable_roles: [],
//     }
// };
//
//     receiveMessage(data) {
//         console.log("Received message " + data.type)
//         console.log(data);
//
//         const logRevealedRoles = (revealedRoles) => {
//             let logMsg = "Changed Roles:";
//             Object.entries(revealedRoles).forEach(
//                 ([player_name, role]) => {
//                     logMsg += `\n${player_name}: ${capitalize(role)}`;
//                 });
//             this.addToActionLog(logMsg);
//         }
//
//         switch (data.type) {
//             case 'worker.player_list_change':
//                 this.setState({players: data['player_list']});
//                 break;
//             case 'worker.start':
//                 this.setState({show_game_setup: false});
//                 if (!this.state.player_name) {
//                     return;
//                 }
//                 this.addToActionLog(
//                     `Your role: ${capitalize(
//                         data['known_roles'][this.state.player_name])}`
//                 );
//                 this.setState({
//                     known_roles: data['known_roles'],
//                     role_info: data['role_info']
//                 })
//                 if (Object.entries(data['known_roles']).length > 1) {
//                     let logMsg = "Known allies:";
//                     Object.entries(data['known_roles']).forEach(
//                         ([player_name, role]) => {
//                             if (player_name === this.state.player_name) {
//                                 return;
//                             }
//                             logMsg += `\n${player_name}: ${capitalize(role)}`
//                         });
//                     this.addToActionLog(logMsg);
//                 }
//                 break;
//             case 'worker.game_master':
//                 this.setState({
//                     is_game_master: true,
//                     configurable_roles: data['configurable_roles'],
//                 });
//                 break;
//             case 'action':
//                 this.setState({
//                     action_data: data
//                 });
//                 break;
//             case 'role_special':
//                 switch (data["result_type"]) {
//                     case "witch":
//                     case "role_for_all":
//                     case "role": {
//                         const newKnownRoles = {...this.state.known_roles, ...data['result']}
//                         logRevealedRoles(data['result']);
//                         this.setState({known_roles: newKnownRoles});
//                         break;
//                     }
//                     case "sentinel": {
//                         const protectedPlayer = data['result'];
//                         const newStatus = {...this.state.players_status};
//                         newStatus[protectedPlayer] = "sentinel"
//                         this.setState({players_status: newStatus});
//                         this.addToActionLog(
//                             `The Sentinel protects ${protectedPlayer}`);
//                         break;
//                     }
//                 }
//                 break;
//             case 'worker.winner':
//                 this.setState({
//                     winner: data['winner'],
//                     vote_results: data['vote_results'],
//                     known_roles: data['known_roles'],
//                     action_log: data['action_log'],
//                     action_data: {},
//                 });
//                 break;
//             case 'worker.players_not_voted_list_change':
//                 // todo
//                 break;
//             case 'worker.reset':
//                 this.setState(this.getInitialState());
//                 break;
//             default:
//                 console.log(data);
//         }
//     }
//
//     nameSubmit(name) {
//         if (this.state.players.includes(name)) {
//             return false;
//         }
//         this.setState({"player_name": name});
//         this.socket.send(JSON.stringify({
//             'type': "name_select",
//             'name': name,
//         }));
//         return true;
//     }
//
//     resetSubmit() {
//         this.socket.send(JSON.stringify({
//             'type': "reset",
//         }));
//     }
//
//     startSubmit(settings) {
//         this.socket.send(JSON.stringify({
//             'type': "start",
//             'settings': settings,
//         }));
//     }
//
//     addToActionLog(log) {
//         const newActionLog = this.state.action_log.slice();
//         newActionLog.push(log);
//         this.setState({action_log: newActionLog})
//     }
//
//     render() {
//         return (
//             <CookiesProvider>
//                 <Container lg>
//                     <Grid container spacing={3}>
//                         <Grid item xs={12}>
//                             <Typography variant="h3">One-Night
//                                 Werewolf</Typography>
//                         </Grid>
//                         <Grid container item xs={12} md={4}>
//                             <Paper style={{height: "100%"}}>
//                                 <GameSetup
//                                     nameSubmit={(n) => this.nameSubmit(n)}
//                                     handleStart={(s) => this.startSubmit(s)}
//                                     visible={this.state.show_game_setup}
//                                     isGameMaster={this.state.is_game_master}
//                                     configurableRoles={this.state.configurable_roles}
//                                     numPlayers={this.state.players.length}
//                                 />
//                                 <GameAction
//                                     socket={this.socket}
//                                     actionData={this.state.action_data}
//                                     name={this.state.player_name}
//                                     players={this.state.players}
//                                     logAction={(l) => this.addToActionLog(l)}
//                                 />
//                             </Paper>
//                         </Grid>
//                         <Grid container item xs={12} md={5} spacing={3}>
//                             <Grid item xs={12} md={6}>
//                                 <Paper style={{height: "100%"}}>
//                                     <GameInfo
//                                         name={this.state.player_name}
//                                         role={this.state.known_roles[this.state.player_name]}
//                                         winner={this.state.winner}
//                                     />
//                                 </Paper>
//                             </Grid>
//                             <Grid container item xs={12} md={6} spacing={3}
//                                   direction={'column'}>
//                                 <Grid item>
//                                     <Paper style={{width: "100%"}}>
//                                         <RoleInfo
//                                             roleInfo={this.state.role_info}/>
//                                     </Paper>
//                                 </Grid>
//                                 <Grid item>
//                                     <Paper style={{width: "100%"}}>
//                                         <ActionLog
//                                             actionLog={this.state.action_log}/>
//                                     </Paper>
//                                 </Grid>
//                             </Grid>
//                         </Grid>
//                         <Grid item xs={12} md={3}>
//                             <Paper style={{height: "100%"}}>
//                                 <PlayersInfo
//                                     players={this.state.players}
//                                     vote_results={this.state.vote_results}
//                                     known_roles={this.state.known_roles}
//                                     status={this.state.players_status}
//                                 />
//                             </Paper>
//                         </Grid>
//                         <Grid item xs={6}>
//                             <Rules/>
//                         </Grid>
//                         <Button
//                             onClick={() => this.resetSubmit()}>Reset</Button>
//                     </Grid>
//                 </Container>
//             </CookiesProvider>
//         )
//     }
// }
//
