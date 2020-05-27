import React from 'react';
import ReactDOM from 'react-dom';
import Game from './Game'
import {SnackbarProvider} from "notistack";
import ThemeProvider from "@material-ui/styles/ThemeProvider";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";

const roomName = JSON.parse(document.getElementById('room_name').textContent);

const socket = new WebSocket(
    `ws://${window.location.host}/ws/werewolf/${roomName}/`
);

const theme = createMuiTheme({
    props: {
        MuiTypography: {
            align: "center",
            variant: "h4",
        },
        MuiButton: {
            size: "large",
            variant: "contained",
        },
    }
})

const notistackRef = React.createRef();
const onCloseSnackbar = key => () => notistackRef.current.closeSnackbar(key);

ReactDOM.render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <SnackbarProvider
                dense
                ref={notistackRef}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                action={(key) => (
                    <IconButton
                        onClick={onCloseSnackbar(key)}
                        aria-label="close"
                        color="inherit"
                    >
                        <CloseIcon/>
                    </IconButton>
                )}>
                <Game roomName={roomName} socket={socket}/>

            </SnackbarProvider>
        </ThemeProvider>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
