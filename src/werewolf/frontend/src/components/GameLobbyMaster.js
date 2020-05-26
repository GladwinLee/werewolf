import React, {useState} from 'react';
import PropTypes from 'prop-types';
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import GameSettingsDialog from "./GameSettingsDialog";

export default function GameLobbyMaster(props) {
    const configurableRoles = props.serverMessage['configurable_roles']
    const [openSettings, setOpenSettings] = useState(false);
    const error = props.numPlayers < 3;

    const clickStart = () => {
        if (error) {
            return;
        }
        props.socket.send(JSON.stringify({
            'type': "start",
        }));
    }

    const clickSettings = () => setOpenSettings(true);
    const onCloseSettings = (settings) => {
        props.socket.send(JSON.stringify({
            'type': "configure_settings",
            'settings': settings,
        }));
        setOpenSettings(false);
    }

    return (
        <>
            <Grid container item xs={12} spacing={3} justify="space-evenly">
                <Grid item>
                    <Button variant="contained" onClick={clickStart}>
                        Start
                    </Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" onClick={clickSettings}>
                        Settings
                    </Button>
                </Grid>
            </Grid>
            <GameSettingsDialog
                handleClose={onCloseSettings}
                open={openSettings}
                configurableRoles={configurableRoles}
            />
        </>
    )
}

GameLobbyMaster.propTypes = {
    socket: PropTypes.object.isRequired,
    numPlayers: PropTypes.number,
    serverMessage: PropTypes.object
}

GameLobbyMaster.defaultProps = {}