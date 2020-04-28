import React from 'react';

function GameInfo(props) {
    let name_display;
    let role_display;
    let winner_display;
    if (props.name) name_display = <div>Name: {props.name}</div>
    if (props.role) role_display = <div>Role: {props.role}</div>
    if (props.winner) winner_display = <div>Winner: {props.winner}</div>

    return (
        <div>
            {name_display}
            {role_display}
            {winner_display}
        </div>
    );
}

export default GameInfo;