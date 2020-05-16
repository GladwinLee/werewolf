import React from 'react';
import Typography from "@material-ui/core/Typography";
import WinnerAlert from "./WinnerAlert";
import capitalize from "@material-ui/core/utils/capitalize";

function GameInfo(props) {
    let name_display;
    if (props.name) name_display = <Typography>Name: {props.name}</Typography>;
    let role_display;
    if (props.role) role_display = <Typography>Role: {capitalize(props.role)}</Typography>;
    let winner_display;
    if (props.winner) winner_display = <WinnerAlert winner={props.winner} />

    return (
        <div>
            {name_display}
            {role_display}
            {winner_display}
        </div>
    );
}

export default GameInfo;