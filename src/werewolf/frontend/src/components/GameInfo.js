import React from 'react';
import Typography from "@material-ui/core/Typography";
import WinnerAlert from "./WinnerAlert";
import RoleCount from "./RoleCount";

function GameInfo(props) {
    const display = [];
    let winner_display;
    if (props.name) display.push(<Typography>Name: {props.name}</Typography>);
    if (props.role) display.push(<Typography>Role: {props.role}</Typography>);
    if (props.winner) winner_display = <WinnerAlert winner={props.winner} />

    return (
        <div>
            {display}
            {winner_display}
            <RoleCount roleCount={props.roleCount}/>
        </div>
    );
}

export default GameInfo;