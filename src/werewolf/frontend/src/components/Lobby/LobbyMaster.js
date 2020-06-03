import React, {useContext, useState} from 'react';
import PropTypes from 'prop-types';
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import SettingsDialog from "./SettingsDialog";
import WebSocketContext from "../WebSocketContext";

export default function LobbyMaster(props) {
    const {socket, serverMessage} = useContext(WebSocketContext)

    const configurableRoles = serverMessage['configurable_roles']
    const [openSettings, setOpenSettings] = useState(false);
    const error = props.numPlayers < 3;

    const clickStart = () => {
        if (error) {
            return;
        }
        socket.send(JSON.stringify({
            'type': "start",
        }));
    }

    const clickSettings = () => setOpenSettings(true);
    const onCloseSettings = (settings) => {
        socket.send(JSON.stringify({
            'type': "configure_settings",
            'settings': settings,
        }));
        setOpenSettings(false);
    }

    return (
        <>
            <Grid container item xs={12} justify="space-evenly">
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
            <SettingsDialog
                handleClose={onCloseSettings}
                open={openSettings}
                configurableRoles={configurableRoles}
            />
        </>
    )
}

LobbyMaster.propTypes = {
    numPlayers: PropTypes.number,
}

LobbyMaster.defaultProps = {}