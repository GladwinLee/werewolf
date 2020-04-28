import React from 'react';

function PlayerList(props) {
    const players = props.players.map((p) => {
        let text = p;

        if (props.werewolves && props.werewolves.includes(p)) {
            text += " (werewolf)";
        }
        if (props.vote_result && Object.keys(props.vote_result).length > 0) {
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