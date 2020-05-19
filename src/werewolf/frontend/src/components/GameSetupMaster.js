import React, {useState} from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import CheckboxList from "./CheckboxList";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from "@material-ui/core/TextField";

export default function GameSetupMaster(props) {
    const initialSelectedRoles = {};
    if (props.configurableRoles) {
        props.configurableRoles.forEach(
            (role) => initialSelectedRoles[role] = false
        );
    }

    const [selectedRoles, setSelectedRoles] = useState(initialSelectedRoles);
    const handleRoleSelect = (choices) => {
        setSelectedRoles(choices);
    };

    const [roleWaitTime, setRoleWaitTime] = React.useState(5);
    const handleRoleWaitTimeChange = (event) => {
        setRoleWaitTime(
            event.target.value === '' ? '' : Number(event.target.value));
    };

    const [voteWaitTime, setVoteWaitTime] = React.useState(5);
    const handleVoteWaitTimeChange = (event) => {
        setVoteWaitTime(
            event.target.value === '' ? '' : Number(event.target.value));
    };

    const handleSubmit = () => {
        const settings = {
            "selected_roles": selectedRoles,
            "role_wait_time": roleWaitTime,
            "vote_wait_time": voteWaitTime,
        }
        props.handleStart(settings);
    }

    return (
        <Grid container spacing={3}>
            <Grid item xs={6}>
                <CheckboxList
                    choices={selectedRoles}
                    handleSelect={handleRoleSelect}
                />
            </Grid>
            <Grid item xs={6} container spacing={3}>
                <Grid item>
                    <TextField
                        value={roleWaitTime}
                        onChange={handleRoleWaitTimeChange}
                        inputProps={{
                            step: 1,
                            min: 1,
                            max: 60,
                            type: 'number',
                            'aria-labelledby': 'input-slider',
                        }}
                        InputProps={{
                            endAdornment: <InputAdornment
                                position="end">seconds</InputAdornment>
                        }}
                        label="Time per vote"
                        variant="outlined"
                    />
                </Grid>
                <Grid item>
                    <TextField
                        value={voteWaitTime}
                        onChange={handleVoteWaitTimeChange}
                        inputProps={{
                            step: 1,
                            min: 1,
                            max: 60,
                            type: 'number',
                            'aria-labelledby': 'input-slider',
                        }}
                        InputProps={{
                            endAdornment: <InputAdornment
                                position="end">minutes</InputAdornment>
                        }}
                        label="Time for vote"
                        variant="outlined"
                    />
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Button variant="contained" onClick={handleSubmit}>
                    {"Start"}
                </Button>
            </Grid>
        </Grid>
    )
}