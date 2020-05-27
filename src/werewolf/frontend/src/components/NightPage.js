import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import NightWait from "./NightWait";
import NightAction from "./NightAction";
import {useSnackbar} from "notistack";

export default function NightPage({socket, serverMessage, roles}) {
    const {action, waiting_on: waitingOn, wait_time: waitTime} = serverMessage;
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();

    useEffect(
        () => {
            const {result_type: resultType, result} = serverMessage
            if (!result) return;
            enqueueSnackbar(<SpecialRoleMessage
                resultType={resultType}
                result={result}
            />);
        },
        [serverMessage]
    )

    return (
        <>
            {(action === "wait") ?
                <NightWait
                    currentRole={waitingOn}
                    roles={roles}
                    waitTime={waitTime}
                />
                : <NightAction
                    action={action}
                    waitTime={waitTime}
                    serverMessage={serverMessage}
                    socket={socket}
                />
            }
        </>
    )
}

function SpecialRoleMessage({resultType, result}) {
    return <>
        {Object.entries(result).map(([name, role]) => `${name} ${role}`)}
    </>;
}

NightPage.propTypes = {
    socket: PropTypes.object,
    serverMessage: PropTypes.object,
    roles: PropTypes.arrayOf(PropTypes.string),
}

NightPage.defaultProps = {
    players: [],
    serverMessage: {},
}