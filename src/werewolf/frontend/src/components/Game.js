import React, {useEffect, useReducer} from 'react';
import Container from "@material-ui/core/Container";
import {NameSelectPage} from "./NameSelectPage";
import PropTypes from 'prop-types';
import LobbyPage from "./LobbyPage";
import PreNightPage from "./PreNightPage";
import Button from "@material-ui/core/Button";
import NightPage from "./NightPage";
import {useSnackbar} from "notistack";
import DayPage from "./DayPage";
import Typography from "@material-ui/core/Typography";
import EndPage from "./EndPage";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles(theme => ({
    container: {
        height: "100vh",
        display: "flex"
    },
    resetButton: {
        position: "absolute",
        bottom: theme.spacing(1),
        right: theme.spacing(1),
    }
}))

const initialState = {
    playerName: "",
    players: [],
    page: "NameSelectPage",
    master: false,
    serverMessage: {},
    settingsMap: {},
    blockJoin: false,
    knownRoles: {},
    infoMessages: [],
    roleCount: {},
}

function reducer(state, {type, value}) {
    if (type === "reset") return initialState;
    if (state[type] == null) {
        console.error(`Invalid setState`);
        console.error(type);
        console.error(value);
        console.error(state);
        return;
    }
    const result = {...state};
    result[type] = value;
    return result;
}

export default function Game(props) {
    const classes = useStyles(props);
    const socket = props.socket;
    const [state, dispatch] = useReducer(reducer, initialState);
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const {
        playerName,
        players,
        page,
        master,
        serverMessage,
        settingsMap,
        blockJoin,
        knownRoles,
        infoMessages,
        roleCount,
    } = state;
    const setState = (type, value) => dispatch({type, value});
    const setIfNotUndefined = (field, value) => {
        if (value) setState(field, value)
    };

    useEffect(
        () => {
            socket.onclose = () => console.error('socket closed unexpectedly');
            socket.onmessage = (e) =>
                setState('serverMessage', JSON.parse(e.data));
        },
        []
    )

    useEffect(
        () => {
            console.log("received message")
            console.log(serverMessage)
            if (serverMessage['type'] === 'worker.reset') {
                closeSnackbar();
                setState('reset');
            }
            setIfNotUndefined("players", serverMessage['player_list']);
            setIfNotUndefined("page", serverMessage['page']);
            setIfNotUndefined("master", serverMessage['master']);
            setIfNotUndefined("settingsMap", serverMessage['settings']);
            setIfNotUndefined("blockJoin", serverMessage['block_join']);
            setIfNotUndefined("knownRoles", serverMessage['known_roles']);
            setIfNotUndefined("roleCount", serverMessage['role_count']);
        },
        [serverMessage]
    )

    useEffect(
        () => {
            const {info_message: infoMessage} = serverMessage
            if (!infoMessage) return;
            infoMessages.push(infoMessage)
            setIfNotUndefined("infoMessages", infoMessages);
            enqueueSnackbar(<InfoMessage message={infoMessage}/>);
        },
        [serverMessage]
    )

    const getPageComponent = (page) => {
        switch (page) {
            case "NameSelectPage":
                return <NameSelectPage
                    onSubmit={(name) => setState("playerName", name)}
                    onChange={(name) => setState("playerName", name)}
                    playerList={players}
                    socket={socket}
                    blockJoin={blockJoin}
                />
            case "LobbyPage":
                return <LobbyPage
                    serverMessage={serverMessage}
                    players={players}
                    settingsMap={settingsMap}
                    master={master}
                    socket={socket}
                />
            case "PreNightPage":
                return <PreNightPage
                    serverMessage={serverMessage}
                    playerName={playerName}
                    knownRoles={knownRoles}
                />
            case "NightPage":
                return <NightPage
                    socket={socket}
                    serverMessage={serverMessage}
                    playerRole={knownRoles[playerName]}
                    roleCount={roleCount}
                />
            case "DayPage":
                return <DayPage
                    socket={socket}
                    serverMessage={serverMessage}
                    infoMessages={infoMessages}
                    roleCount={roleCount}
                />
            case "EndPage":
                return <EndPage
                    socket={socket}
                    serverMessage={serverMessage}
                    master={master}
                />
        }
        return null;
    }

    const resetSubmit = () => {
        socket.send(JSON.stringify({
            'type': "reset",
        }));
    }

    if (serverMessage && serverMessage['type' === "worker.reset"]) return null;
    return <Container maxWidth="xs" className={classes.container}>
        {getPageComponent(page)}
        {playerName === "KEN" &&
        <Button
            onClick={() => resetSubmit()}
            size="small"
            className={classes.resetButton}
        >
            Reset
        </Button>}
    </Container>
}

Game.propTypes = {
    socket: PropTypes.object.isRequired,
}

function InfoMessage({message}) {
    return <Typography>{message}</Typography>;
}
