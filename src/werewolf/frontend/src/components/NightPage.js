import React, {useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import NightWait from "./NightWait";
import NightAction from "./NightAction";
import WebSocketContext from "./WebSocketContext";
import Grid from "@material-ui/core/Grid";
import PageGrid from "./PageGrid";
import Typography from "@material-ui/core/Typography";

export default function NightPage({roleCount, playerRole, totalWaitTime}) {
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
        <PageGrid alignContent={"stretch"}>
            <Grid item xs={12}>
                <Typography variant="h3" gutterBottom>
                    Night time
                </Typography>
            </Grid>
            {/*<Grid item xs={12}>*/}
            {/*    <NightAnimatedIcon time={totalWaitTime}/>*/}
            {/*</Grid>*/}
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
        </PageGrid>
    )
}

NightPage.propTypes = {
    roleCount: PropTypes.object,
    playerRole: PropTypes.string,
    totalWaitTime: PropTypes.number,
}

NightPage.defaultProps = {
    players: [],
}