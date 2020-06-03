import React from 'react';
import PropTypes from 'prop-types';
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import PlayerList from "./PlayerList";
import LobbyRoleInfo from "./LobbyRoleInfo";
import LobbyMaster from "./LobbyMaster";
import PageGrid from "../PageGrid";

export default function LobbyPage(props) {
    return (
        <PageGrid alignContent="space-between">
            <Grid container item xs={12}>
                <Grid item xs={12}>
                    <Typography variant="h3" color="textPrimary">
                        Lobby
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <PlayerList players={props.players}/>
                </Grid>
                <Grid item xs={12}>
                    <LobbyRoleInfo settingsMap={props.settingsMap}/>
                </Grid>
            </Grid>
            {(props.master) ?
                <LobbyMaster
                    numPlayers={props.players.length}
                />
                : <Grid item xs={12}>
                    <Typography>
                        Waiting for Game Master to start
                    </Typography>
                </Grid>
            }
        </PageGrid>
    )
}

LobbyPage.propTypes = {
    settingsMap: PropTypes.object.isRequired,
    players: PropTypes.arrayOf(PropTypes.string).isRequired,
    master: PropTypes.bool,
}

LobbyPage.defaultProps = {
    master: false,
}