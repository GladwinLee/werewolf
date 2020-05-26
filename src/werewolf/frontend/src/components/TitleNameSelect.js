import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import React, {useState} from "react";
import {useCookies} from "react-cookie";
import PropTypes from 'prop-types';
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";

const ERR_MSG_NAME_EMPTY = "Cannot be empty";
const ERR_MSG_NAME_TAKEN = "Name already taken";

export function TitleNameSelect({playerList, socket, onSubmit}) {
    const [cookies, setCookie] = useCookies(['playerName'])
    const [name, setName] = useState(cookies.playerName)
    const [errorMsg, setErrorMsg] = useState(null);

    const getErrorMsg = (name) => {
        if (!name || name === "") {
            return ERR_MSG_NAME_EMPTY;
        } else if (playerList.includes(name)) {
            return ERR_MSG_NAME_TAKEN;
        }
        return null;
    };

    const handleChange = (e) => {
        setName(e.target.value);
        if (errorMsg) {
            setErrorMsg(getErrorMsg(e.target.value));
        }
    }

    const handleSubmit = () => {
        const newErrorMsg = getErrorMsg(name);
        if (newErrorMsg) {
            setErrorMsg(newErrorMsg)
            return;
        }
        setCookie('playerName', name);
        socket.send(JSON.stringify({
            'type': "name_select",
            'name': name,
        }));
        onSubmit(name);
    }

    return (
        <>
            <Typography variant="h2" align="center" color="textPrimary"
                        gutterBottom>
                One-Night Werewolf
            </Typography>
            <Grid container alignItems="center" justify="center"
                  direction="column" spacing={3}>
                <Grid item>
                    <TextField
                        id="name-input"
                        error={!!errorMsg}
                        onKeyPress={(e) => e.key === "Enter" ? handleSubmit()
                            : null}
                        onChange={handleChange}
                        value={name}
                        helperText={errorMsg}
                        label="Name"
                        variant="outlined"
                    />
                </Grid>
                <Grid item>
                    <Button variant="contained" onClick={handleSubmit}>Enter
                        name</Button>
                </Grid>
            </Grid>
        </>
    );
}

TitleNameSelect.propTypes = {
    playerList: PropTypes.arrayOf(PropTypes.string),
    onSubmit: PropTypes.func,
    socket: PropTypes.object,
}