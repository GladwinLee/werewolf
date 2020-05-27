import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import React, {useState} from "react";
import {useCookies} from "react-cookie";
import PropTypes from 'prop-types';
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import {makeStyles} from "@material-ui/core/styles";

const ERR_MSG_NAME_EMPTY = "Cannot be empty";
const ERR_MSG_NAME_TAKEN = "Name already taken";

const useStyles = makeStyles({
    input: {
        textAlign: "center",
        fontSize: "large",
        maxLength: 20,
    }
})

export function NameSelectPage({playerList, socket, onSubmit}) {
    const classes = useStyles();

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
        let value = e.target.value.replace(/[\W_]+/g, "");
        setName(value);
        if (errorMsg) {
            setErrorMsg(getErrorMsg(value));
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
                        autoFocus
                        fullWidth
                        error={!!errorMsg}
                        onKeyPress={(e) => e.key === "Enter" ? handleSubmit()
                            : null}
                        inputProps={{className: classes.input}}
                        onChange={handleChange}
                        value={name}
                        helperText={errorMsg}
                        variant="outlined"
                    />
                </Grid>
                <Grid item>
                    <Button onClick={handleSubmit}>Enter
                        name</Button>
                </Grid>
            </Grid>
        </>
    );
}

NameSelectPage.propTypes = {
    playerList: PropTypes.arrayOf(PropTypes.string),
    onSubmit: PropTypes.func,
    socket: PropTypes.object,
}