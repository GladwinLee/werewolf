import React, {useState} from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import RoleSelector from "./RoleSelector";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from "@material-ui/core/TextField";
import {useCookies} from "react-cookie";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";

export default function GameSetupMaster(props) {
    const [cookies, setCookies] = useCookies(
        ["selectedRoles", "roleWaitTime", "voteWaitTime", "numWerewolves"]);

    const [configurableRoles, setConfigurableRoles] = useState(
        props.configurableRoles)

    const initialSelectedRoles = {};
    if (configurableRoles) {
        configurableRoles.forEach(
            (role) => initialSelectedRoles[role] = cookies.selectedRoles
                && !!cookies.selectedRoles[role]
        );
    }

    const [selectedRoles, setSelectedRoles] = useState(initialSelectedRoles);
    const [roleWaitTime, setRoleWaitTime] = React.useState(
        (cookies.roleWaitTime == null) ? 7 : cookies.roleWaitTime
    );
    const [voteWaitTime, setVoteWaitTime] = React.useState(
        (cookies.voteWaitTime == null) ? 5 : cookies.voteWaitTime
    );
    const [numWerewolves, setNumWerewolves] = React.useState(
        (cookies.numWerewolves == null) ? 2 : cookies.numWerewolves
    );

    const handleRoleSelect = (choices) => setSelectedRoles(choices);
    const handleRoleWaitTimeChange = (event) => setRoleWaitTime(
        event.target.value);
    const handleVoteWaitTimeChange = (event) => setVoteWaitTime(
        event.target.value);
    const handleNumWerewolvesChange = (event) => setNumWerewolves(
        event.target.value);

    const error = props.numPlayers < 3;
    const handleSubmit = () => {
        if (error) {
            return;
        }
        const settings = {
            "selected_roles": selectedRoles,
            "role_wait_time": roleWaitTime,
            "vote_wait_time": voteWaitTime,
            "num_werewolves": numWerewolves,
        }
        props.handleStart(settings);
        setCookies("selectedRoles", selectedRoles);
        setCookies("roleWaitTime", roleWaitTime);
        setCookies("voteWaitTime", voteWaitTime);
        setCookies("numWerewolves", numWerewolves);
    }

    return (
        <Grid container item spacing={3}>
            <Grid item xs={6}>
                <RoleSelector
                    choices={selectedRoles}
                    handleSelect={handleRoleSelect}
                />
            </Grid>
            <Grid item xs={6} container spacing={3} direction="column">
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
                        label="Time for role action"
                        variant="outlined"
                    />
                </Grid>
                <Grid item>
                    <TextField
                        value={voteWaitTime}
                        onChange={handleVoteWaitTimeChange}
                        inputProps={{
                            step: 0.5,
                            min: 0,
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
                <Grid item>
                    <TextField
                        value={numWerewolves}
                        onChange={handleNumWerewolvesChange}
                        inputProps={{
                            step: 1,
                            min: 1,
                            max: 60,
                            type: 'number',
                            'aria-labelledby': 'input-slider',
                        }}
                        label="Werewolves"
                        variant="outlined"
                    />
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <FormControl error={error}>
                    <Button variant="contained" disabled={error}
                            onClick={handleSubmit}>
                        {"Start"}
                    </Button>
                    <FormHelperText>
                        {error && "Minimum 3 players to start"}
                    </FormHelperText>
                </FormControl>
            </Grid>
        </Grid>
    )
}