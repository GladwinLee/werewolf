import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import React from "react";

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
        <div>
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
            <Button variant="contained" onClick={handleSubmit}>Choose name</Button>
        </div>
    );
}