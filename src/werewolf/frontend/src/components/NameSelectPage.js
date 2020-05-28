import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import React, {useState} from "react";
import {useCookies} from "react-cookie";
import PropTypes from 'prop-types';
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import {makeStyles} from "@material-ui/core/styles";
import PageGrid from "./PageGrid";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";

const ERR_MSG_NAME_EMPTY = "Cannot be empty";
const ERR_MSG_NAME_TAKEN = "Name already taken";

const useStyles = makeStyles({
    input: {
        textAlign: "center",
        fontSize: "2rem"
    },
    helperText: {
        textAlign: "center",
    }
})

export function NameSelectPage({playerList, socket, onChange, onSubmit, blockJoin}) {
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
        onChange(value);
    }

    const handleSubmit = () => {
        const newErrorMsg = getErrorMsg(name);
        if (blockJoin || newErrorMsg) {
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
                    <FormHelperText error={!!errorMsg}
                                    className={classes.helperText}>
                        {errorMsg || " "}
                    </FormHelperText>
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
                        variant="outlined"
                    />
                </Grid>
                <Grid item>
                    <FormControl disabled={blockJoin}>
                        <Button onClick={handleSubmit} disabled={blockJoin}>Enter
                            name</Button>
                        <FormHelperText>
                            {(blockJoin) ? "Game Started - Wait for next game"
                                : " "}
                        </FormHelperText>
                    </FormControl>
                </Grid>
            </Grid>
        </PageGrid>
    );
}

NameSelectPage.propTypes = {
    playerList: PropTypes.arrayOf(PropTypes.string),
    onSubmit: PropTypes.func,
    onChange: PropTypes.func,
    socket: PropTypes.object,
    blockJoin: PropTypes.bool
}
