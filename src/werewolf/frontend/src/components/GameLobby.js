import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import PlayerList from "./PlayerList";
import SettingsInfo from "./SettingsInfo";
import GameLobbyMaster from "./GameLobbyMaster";

export default function GameLobby(props) {
    const [settingsMap, setSettingsMap] = useState(null);
    useEffect(
        () => {
            if (props.serverMessage["settings"] == null) {
                return;
            }
            setSettingsMap(props.serverMessage["settings"]);
        },
        [props.serverMessage]
    )

    return (
        <>
            <Typography variant="h2" align="center" color="textPrimary"
                        gutterBottom>
                One-Night Werewolf
            </Typography>
            <Grid container spacing={3} justify="center">
                <Grid item xs={6}>
                    <PlayerList players={props.players}/>
                </Grid>
                <Grid item xs={6}>
                    <SettingsInfo settingsMap={settingsMap}/>
                </Grid>
                {(props.master) ?
                    <GameLobbyMaster
                        socket={props.socket}
                        serverMessage={props.serverMessage}
                        players={props.players.length}
                    />
                    : <Grid item>
                        <Typography>Waiting for game master to start the
                            game</Typography>
                    </Grid>
                }
            </Grid>
        </>
    )
}

GameLobby.propTypes = {
    players: PropTypes.arrayOf(PropTypes.string),
    socket: PropTypes.object,
    master: PropTypes.bool,
    serverMessage: PropTypes.object,
}

GameLobby.defaultProps = {
    players: [],
    master: false,
    serverMessage: {},
}