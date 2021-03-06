import React, {useContext, useEffect, useReducer} from 'react';
import Container from "@material-ui/core/Container";
import {NameSelectPage} from "./NameSelectPage";
import LobbyPage from "./Lobby/LobbyPage";
import PreNightPage from "./PreNightPage";
import Button from "@material-ui/core/Button";
import NightPage from "./Night/NightPage";
import {useSnackbar} from "notistack";
import DayPage from "./Day/DayPage";
import Typography from "@material-ui/core/Typography";
import EndPage from "./End/EndPage";
import makeStyles from "@material-ui/core/styles/makeStyles";
import WebSocketContext from "./WebSocketContext";
import Rules from "./Rules";

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
    settingsMap: {},
    blockJoin: false,
    knownRoles: {},
    infoMessages: [],
    roleCount: {},
    finalNightRole: "",
    containerStyle: {},
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
    const {socket, serverMessage} = useContext(WebSocketContext);

    const [state, dispatch] = useReducer(reducer, initialState);
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const {
        playerName,
        players,
        page,
        master,
        settingsMap,
        blockJoin,
        knownRoles,
        infoMessages,
        roleCount,
        finalNightRole,
        containerStyle,
    } = state;
    const setState = (type, value) => dispatch({type, value});
    const setIfNotUndefined = (field, value) => {
        if (value) setState(field, value)
    };

    useEffect(
        () => {
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
            setIfNotUndefined("finalNightRole",
                serverMessage['final_night_role']);
        },
        [serverMessage]
    )

    useEffect(
        () => {
            const {info_message: infoMessage} = serverMessage
            if (!infoMessage) return;
            infoMessages.push(infoMessage)
            setIfNotUndefined("infoMessages", infoMessages);
            console.log("New info message")
            console.log(infoMessages)
            enqueueSnackbar(infoMessage);
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
                    blockJoin={blockJoin}
                />
            case "LobbyPage":
                return <LobbyPage
                    players={players}
                    settingsMap={settingsMap}
                    master={master}
                    socket={socket}
                />
            case "PreNightPage":
                return <PreNightPage
                    playerName={playerName}
                    knownRoles={knownRoles}
                />
            case "NightPage":
                return <NightPage
                    playerRole={knownRoles[playerName]}
                    roleCount={roleCount}
                    finalNightRole={finalNightRole}
                    changeContainerStyle={changeContainerStyle}
                />
            case "DayPage":
                return <DayPage
                    infoMessages={infoMessages}
                    roleCount={roleCount}
                />
            case "EndPage":
                return <EndPage
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

    const changeContainerStyle = (style) => {
        setIfNotUndefined("containerStyle", style);
    }

    if (serverMessage && serverMessage['type' === "worker.reset"]) return null;
    return <Container maxWidth="xs" className={classes.container}
                      style={containerStyle}>
        {getPageComponent(page)}
        <Rules/>
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
}

function InfoMessage({message}) {
    return <Typography>{message}</Typography>;
}
