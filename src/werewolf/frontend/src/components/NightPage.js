import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import NightWait from "./NightWait";
import NightAction from "./NightAction";

export default function NightPage({socket, serverMessage, roleCount, playerRole}) {
    const [action, setAction] = useState(serverMessage['action']);
    const [waitingOn, setWaitingOn] = useState(serverMessage['waiting_on']);
    const [waitTime, setWaitTime] = useState(serverMessage['wait_time']);

    const setIfNotUndefined = (setFunction, value) => {
        if (value == null) return;
        setFunction(value);
    }

    useEffect(() => {
            setIfNotUndefined(setAction, serverMessage['action'])
            setIfNotUndefined(setWaitingOn, serverMessage['waiting_on'])
            setIfNotUndefined(setWaitTime, serverMessage['wait_time'])
        }, [serverMessage]
    )

    return (
        <>
            {(action === "wait") ?
                <NightWait
                    currentRole={waitingOn}
                    roleCount={roleCount}
                    waitTime={waitTime}
                    playerRole={playerRole}
                />
                : <NightAction
                    action={action}
                    waitTime={waitTime}
                    serverMessage={serverMessage}
                    socket={socket}
                />}
        </>
    )
}

NightPage.propTypes = {
    socket: PropTypes.object,
    serverMessage: PropTypes.object,
    roleCount: PropTypes.object,
    playerRole: PropTypes.string,
}

NightPage.defaultProps = {
    players: [],
    serverMessage: {},
}