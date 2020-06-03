import React, {useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import NightWait from "./NightWait";
import NightAction from "./NightAction";
import WebSocketContext from "../WebSocketContext";
import Grid from "@material-ui/core/Grid";
import PageGrid from "../PageGrid";
import Typography from "@material-ui/core/Typography";
import NightAnimatedIcon from "./NightAnimatedIcon";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles({});
export default function NightPage({roleCount, playerRole, finalNightRole: propFinalNightRole, ...props}) {
    const {serverMessage} = useContext(WebSocketContext)

    const [action, setAction] = useState(serverMessage['action']);
    const [waitingOn, setWaitingOn] = useState(serverMessage['waiting_on']);
    const [waitTime, setWaitTime] = useState(serverMessage['wait_time']);
    const [finalNightRole] = useState(propFinalNightRole);
    const [propIn, setPropIn] = useState(false);

    const setIfNotUndefined = (setFunction, value) => {
        if (value == null) return;
        setFunction(value);
    }

    useEffect(() => {
        setIfNotUndefined(setAction, serverMessage['action'])
        setIfNotUndefined(setWaitingOn, serverMessage['waiting_on'])
        setIfNotUndefined(setWaitTime, serverMessage['wait_time'])
    }, [serverMessage])

    const currentRole = (action !== "wait") ? action : waitingOn;

    useEffect(
        () => {
            console.log("Current", currentRole);
            console.log("Final", finalNightRole);
            if (currentRole === finalNightRole) setPropIn(false);
            else {
                setTimeout(() => setPropIn(true), 100)
            }
        },
        [currentRole]
    )

    useEffect(
        () => {
            props.changeContainerStyle({
                transition: `background-color 1s linear ${(propIn) ? 0
                    : waitTime - 2}s`,
                backgroundColor: (propIn) ? "lightgrey" : "inherit",
            })
        },
        [propIn, waitTime]
    )

    return (
        <>
            <NightAnimatedIcon time={4000} in={propIn} endDelay={waitTime}/>
            <PageGrid
                alignContent={"stretch"}
            >
                <Grid item xs={12}>
                    <Typography variant="h3" gutterBottom>
                        Night time
                    </Typography>
                </Grid>
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
        </>
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