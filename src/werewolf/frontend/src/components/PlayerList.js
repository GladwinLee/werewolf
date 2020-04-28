import React from 'react';

function PlayerList(props) {
    const players = props.players.map((p) => {
        return <li key={p}>{p}</li>
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