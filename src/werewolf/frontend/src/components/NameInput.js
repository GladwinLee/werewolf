import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import React from "react";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";

export function NameInput(props) {
    const [value, setValue] = React.useState("");
    const [error, setError] = React.useState(false);

    const handleChange = (e) => {
        setValue(e.target.value);
        if (error && value !== "") {
            setError(false);
        }
    }

    const handleSubmit = () => {
        if (value === "") {
            setError(true);
            return;
        }
        props.onSubmit(value);
    }

    return (
        <Grid container direction="row" alignItems="center">
            <Grid item>
                <TextField
                    error={error}
                    id="chat-message-input" type="text"
                    onKeyPress={(e) => e.key === "Enter" ? handleSubmit() : null}
                    onChange={handleChange}
                    value={value}
                    helperText={error ? "Cannot be empty" : ""}
                    label="Name"
                    variant="outlined"
                />
            </Grid>
            <Grid item>
                <Button variant="contained" onClick={handleSubmit}>Choose name</Button>
            </Grid>
        </Grid>
    );
}