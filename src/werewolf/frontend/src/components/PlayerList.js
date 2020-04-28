import React from 'react';

function PlayerList(props) {
    const players = props.players.map((p) => {
        let text = p;

        if (props.known_roles) {
            const role = props.known_roles[p]
            if (role) {
                text += " (" + role + ")";
            }
        }
        if (props.vote_result) {
            const votes = props.vote_result[p];
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