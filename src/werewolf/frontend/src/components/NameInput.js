import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import React from "react";
import Grid from "@material-ui/core/Grid";
import {useCookies} from "react-cookie";

const ERR_MSG_NAME_EMPTY = "Cannot be empty";
const ERR_MSG_NAME_TAKEN = "Name already taken";

export function NameInput(props) {
    const [cookies, setCookie] = useCookies(['player_name'])
    const [error, setError] = React.useState(false);
    const [errorMsg, setErrorMsg] = React.useState(null);

    const handleChange = (e) => {
        setCookie('player_name', e.target.value);
        if (error && cookies.player_name !== "") {
            setError(false);
        }
    }

    const handleSubmit = () => {
        if (cookies.player_name === "") {
            setError(true);
            setErrorMsg(ERR_MSG_NAME_EMPTY);
            return;
        }
        const success = props.onSubmit(cookies.player_name);
        if (!success) {
            setError(true);
            setErrorMsg(ERR_MSG_NAME_TAKEN);
        }
    }

    return (
        <Grid container item direction="row" alignItems="center">
            <Grid item>
                <TextField
                    error={error}
                    id="name-input" type="text"
                    onKeyPress={(e) => e.key === "Enter" ? handleSubmit()
                        : null}
                    onChange={handleChange}
                    value={cookies.player_name}
                    helperText={error ? errorMsg : ""}
                    label="Name"
                    variant="outlined"
                />
            </Grid>
            <Grid item>
                <Button variant="contained" onClick={handleSubmit}>Enter name</Button>
            </Grid>
        </Grid>
    );
}