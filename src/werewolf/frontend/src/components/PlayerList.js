import React from 'react';

function PlayerList(props) {
    const playerList = props.players.slice()
    if (props.known_roles && props.known_roles["Middle 1"]) {
        playerList.push("Middle 1", "Middle 2", "Middle 3");
    }

    const players = playerList.map((p) => {
        let text = p;

        if (props.known_roles) {
            const role = props.known_roles[p]
            if (role) {
                text += " (" + role + ")";
            }
        }
        if (props.vote_results) {
            const votes = props.vote_results[p];
            if (votes) {
                text +=  " " + votes;
            }
        }
        return <li key={p}>{text}</li>;
    });
    return (
        <div>
            <ul>
                {players}
            </ul>
        </div>
    );
}

export default PlayerList;