import React from 'react';
import PropTypes from 'prop-types';
import NightWait from "./NightWait";
import NightAction from "./NightAction";

export default function NightPage({socket, serverMessage, roles, playerRole}) {
    const {action, waiting_on: waitingOn, wait_time: waitTime} = serverMessage;

    return (action === "wait") ?
        <NightWait
            currentRole={waitingOn}
            roles={roles}
            waitTime={waitTime}
            playerRole={playerRole}
        />
        : <NightAction
            action={action}
            waitTime={waitTime}
            serverMessage={serverMessage}
            socket={socket}
        />

}

NightPage.propTypes = {
    socket: PropTypes.object,
    serverMessage: PropTypes.object,
    roles: PropTypes.arrayOf(PropTypes.string),
    playerRole: PropTypes.string,
}

NightPage.defaultProps = {
    players: [],
    serverMessage: {},
}