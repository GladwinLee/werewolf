import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import React, {useState} from "react";
import {useCookies} from "react-cookie";
import PropTypes from 'prop-types';
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import {makeStyles} from "@material-ui/core/styles";
import PageGrid from "./PageGrid";

const ERR_MSG_NAME_EMPTY = "Cannot be empty";
const ERR_MSG_NAME_TAKEN = "Name already taken";

const useStyles = makeStyles({
    input: {
        textAlign: "center",
        fontSize: "2rem"
    },
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
        let value = e.target.value;
        if (value.length > 11) return;
        value = value.replace(/[\W_]+/g, "").toUpperCase();
        setName(value);
        if (errorMsg) setErrorMsg(getErrorMsg(value));
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
        <PageGrid height={"80%"}>
            <Grid item xs={12}>
                <Typography variant="h1" align="center" color="textPrimary"
                            gutterBottom>
                    One-Night Werewolf
                </Typography>
            </Grid>
            <Grid container item spacing={3} justify="center">
                <Grid item xs={10}>
                    <TextField
                        autoFocus
                        fullWidth
                        error={!!errorMsg}
                        spellCheck={false}
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
                    <Button onClick={handleSubmit}>Enter name</Button>
                </Grid>
            </Grid>
        </PageGrid>
    );
}

NameSelectPage.propTypes = {
    playerList: PropTypes.arrayOf(PropTypes.string),
    onSubmit: PropTypes.func,
    socket: PropTypes.object,
}