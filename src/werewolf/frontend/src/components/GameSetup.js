import React, {useState} from 'react';
import {NameSelectPage} from "./NameSelectPage";
import GameSetupMaster from "./GameSetupMaster";
import PropTypes from "prop-types";

export default function GameSetup(props) {
    const [showNameInput, setShowNameInput] = useState(true);

    if (!props.visible) {
        return null;
    }

    const nameSubmit = (name) => {
        const success = props.nameSubmit(name);
        if (success) {
            setShowNameInput(false);
        }
        return success;
    }

    let name_display = (showNameInput) ? <NameSelectPage
            onSubmit={nameSubmit}/>
        : null
    let game_master_display;
    if (props.isGameMaster) {
        game_master_display = <GameSetupMaster
            handleStart={props.handleStart}
            configurableRoles={props.configurableRoles}
            numPlayers={props.numPlayers}
        />
    }

    return (
        <>
            {name_display}
            {game_master_display}
        </>
    )
}

GameSetup.propTypes = {
    visible: PropTypes.bool,
    isGameMaster: PropTypes.bool,
    handleStart: PropTypes.func,
    nameSubmit: PropTypes.func,
    configurableRoles: PropTypes.array,
    numPlayers: PropTypes.number,
}