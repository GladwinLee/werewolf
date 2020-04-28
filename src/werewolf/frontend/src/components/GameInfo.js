import React from 'react';
import PlayerList from "./PlayerList";

function GameInfo(props) {
        let name_display;
        let role_display;
        let werewolves_display;
        if (props.name) name_display = <div>Name: {props.name}</div>
        if (props.role) role_display = <div>Role: {props.role}</div>
        if (props.werewolves && props.werewolves.length > 0) werewolves_display = <div>
            Team Werewolf
            <PlayerList players={props.werewolves}/>
        </div>
    return (
        <div>
            {name_display}
            {role_display}
            {werewolves_display}
        </div>
    );
}

export default GameInfo;