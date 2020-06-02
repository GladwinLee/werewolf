import React, {useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import NightWait from "./NightWait";
import NightAction from "./NightAction";
import WebSocketContext from "./WebSocketContext";

export default function NightPage({roleCount, playerRole}) {
    const {serverMessage} = useContext(WebSocketContext)

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
                />}
        </>
    )
}

NightPage.propTypes = {
    roleCount: PropTypes.object,
    playerRole: PropTypes.string,
}

NightPage.defaultProps = {
    players: [],
}