import React from 'react';
import PropTypes from 'prop-types';
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import PlayerList from "./PlayerList";
import SettingsInfo from "./SettingsInfo";
import LobbyMaster from "./LobbyMaster";

export default function LobbyPage(props) {
    return (
        <>
            <Typography variant="h2" gutterBottom>
                One-Night Werewolf
            </Typography>
            <Grid container spacing={3} justify="center">
                <Grid item xs={6}>
                    <PlayerList players={props.players}/>
                </Grid>
                <Grid item xs={6}>
                    <SettingsInfo settingsMap={props.settingsMap}/>
                </Grid>
                {(props.master) ?
                    <LobbyMaster
                        socket={props.socket}
                        serverMessage={props.serverMessage}
                        numPlayers={props.players.length}
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

LobbyPage.propTypes = {
    settingsMap: PropTypes.object.isRequired,
    players: PropTypes.arrayOf(PropTypes.string).isRequired,
    socket: PropTypes.object.isRequired,
    master: PropTypes.bool,
    serverMessage: PropTypes.object,
}

LobbyPage.defaultProps = {
    master: false,
    serverMessage: {},
}