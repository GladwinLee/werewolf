import React from 'react';
import ReactDOM from 'react-dom';
import Game from './Game'
import {SnackbarProvider} from "notistack";
import ThemeProvider from "@material-ui/styles/ThemeProvider";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import CssBaseline from "@material-ui/core/CssBaseline";
import responsiveFontSizes from "@material-ui/core/styles/responsiveFontSizes";
import InfoMessage from "./InfoMessage";

const roomName = JSON.parse(document.getElementById('room_name').textContent);

const socket = new WebSocket(
    `ws://${window.location.host}/ws/werewolf/${roomName}/`
);

let theme = createMuiTheme();
theme = {
    ...theme,
    overrides: {
        MuiTypography: {
            body1: {
                fontSize: "1.3rem",
            },
        },
        MuiButton: {
            label: {
                fontSize: "1.5rem",
            }
        },
        MuiTooltip: {
            tooltip: {
                backgroundColor: theme.palette.common.white,
                color: 'rgba(0,0,0,0.87)',
                boxShadow: theme.shadows[1],
                fontSize: "1.3rem",
            }
        },
        MuiGrid: {
            item: {
                align: "center",
            }
        }
    },
    props: {
        MuiTypography: {
            align: "center",
        },
        MuiButton: {
            size: "large",
            variant: "contained",
        },
    }
};

theme = responsiveFontSizes(theme);

const notistackRef = React.createRef();
const onCloseSnackbar = key => () => notistackRef.current.closeSnackbar(key);

ReactDOM.render(
    <React.StrictMode>
        <CssBaseline/>
        <ThemeProvider theme={theme}>
            <SnackbarProvider
                dense
                ref={notistackRef}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                hideIconVariant
                variant={"info"}
                content={(key, message) => (
                    <InfoMessage id={key} message={message}/>
                )}
            >
                <Game roomName={roomName} socket={socket}/>
            </SnackbarProvider>
        </ThemeProvider>
    </React.StrictMode>
    ,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
