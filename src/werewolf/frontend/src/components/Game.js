import React, {Component} from 'react';
import GameSetup from './GameSetup'
import Vote from './Vote';
import PlayerList from './PlayerList';

class Game extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            players: [],
            show_vote_input: false,
            show_game_setup: true,
        };

        this.chatSocket.onmessage = (e) => {
            this.receiveMessage(JSON.parse(e.data));
        };

        this.chatSocket.onclose = (e) => {
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
        this.setState({"name": name});
        this.chatSocket.send(JSON.stringify({
            'type': "name_select",
            'message': name,
        }));
    }

    startSubmit() {
        this.setState({show_game_setup: false, show_vote_input: true})
        this.chatSocket.send(JSON.stringify({
            'type': "start",
            'name': this.state.name,
        }));
    }

    voteSubmit(vote) {
        this.chatSocket.send(JSON.stringify({
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

export default Game;