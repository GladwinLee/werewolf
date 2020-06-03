import React, {useEffect, useState} from "react";
import Grid from "@material-ui/core/Grid";
import RoleSelector from "./RoleSelector";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from "@material-ui/core/TextField";
import {useCookies} from "react-cookie";
import Dialog from "@material-ui/core/Dialog";
import PropTypes from "prop-types";
import {makeStyles} from "@material-ui/core/styles";
import WerewolfSelector from "./WerewolfSelector";

const useStyles = makeStyles((theme) => ({
    dialog: {
        height: "100%",
    },
    paper: {
        overflow: "hidden",
    },
    dialogGrid: {
        height: "100%",
        padding: theme.spacing(3),
    },
    input: {
        fontSize: "1.3rem"
    },
}))

const defaultPreNightWait = 15;
const defaultRoleWait = 10;
const defaultVoteWait = 5;
const defaultNumWerewolves = 2;

function validOrDefault(v, defaultValue) {
    return (!v || v < 0) ? defaultValue : v
}

export default function SettingsDialog(props) {
    const classes = useStyles(props);
    const [cookies, setCookies] = useCookies(
        ["selectedRoles", "preNightWaitTime", "roleWaitTime", "voteWaitTime",
            "numWerewolves"]);

    const initialSelectedRoles = {};
    if (props.configurableRoles) {
        props.configurableRoles.forEach(
            (role) => initialSelectedRoles[role] =
                cookies.selectedRoles && !!cookies.selectedRoles[role]);
    }

    const [selectedRoles, setSelectedRoles] = useState(initialSelectedRoles);
    const [preNightWaitTime, setPreNightWaitTime] = useState(
        (cookies.preNightWaitTime == null) ?
            defaultPreNightWait : Number(cookies.preNightWaitTime));
    const [roleWaitTime, setRoleWaitTime] = useState(
        (cookies.roleWaitTime == null) ?
            defaultRoleWait : Number(cookies.roleWaitTime));
    const [voteWaitTime, setVoteWaitTime] = useState(
        (cookies.voteWaitTime == null) ?
            defaultVoteWait : Number(cookies.voteWaitTime));
    const [numWerewolves, setNumWerewolves] = useState(
        (cookies.numWerewolves == null) ?
            defaultNumWerewolves : Number(cookies.numWerewolves));

    const validPreNightWaitTime = validOrDefault(preNightWaitTime,
        defaultPreNightWait);
    const validRoleWaitTime = validOrDefault(roleWaitTime);
    const validVoteWaitTime = validOrDefault(voteWaitTime);
    const validNumWerewolves = validOrDefault(numWerewolves);

    const handleRoleSelect = (choices) => setSelectedRoles(choices);
    const handlePreNightWaitTimeChange = (event) => {
        let value = event.target.value;
        if (value > 60) return;
        setPreNightWaitTime(value);
    };
    const handleRoleWaitTimeChange = (event) => {
        let value = event.target.value;
        if (value > 60) return;
        setRoleWaitTime(value);
    };
    const handleVoteWaitTimeChange = (event) => {
        let value = event.target.value;
        if (value > 60) return;
        setVoteWaitTime(value);
    }
    const handleNumWerewolvesChange = setNumWerewolves;

    const settings = {
        "selected_roles": selectedRoles,
        "pre_night_wait_time": validPreNightWaitTime,
        "role_wait_time": validRoleWaitTime,
        "vote_wait_time": validVoteWaitTime,
        "num_werewolves": validNumWerewolves,
    };

    // Send initial settings on first render
    useEffect(() => props.handleClose(settings), [])

    const handleClose = () => {
        setCookies("selectedRoles", selectedRoles);
        setCookies("preNightWaitTime", validPreNightWaitTime);
        setCookies("roleWaitTime", validRoleWaitTime);
        setCookies("voteWaitTime", validVoteWaitTime);
        setCookies("numWerewolves", validNumWerewolves);

        // Set the state for if they re open
        setPreNightWaitTime(validPreNightWaitTime);
        setRoleWaitTime(validRoleWaitTime);
        setVoteWaitTime(validVoteWaitTime);
        setNumWerewolves(validNumWerewolves);

        props.handleClose(settings);
    }

    return (
        <Dialog open={props.open} onClose={handleClose}
                classes={{paper: classes.paper}}>
            <Grid container spacing={3} className={classes.dialogGrid}>
                <Grid item xs={12}>
                    <WerewolfSelector
                        numWerewolves={numWerewolves}
                        handleChange={handleNumWerewolvesChange}
                    />
                </Grid>
                <Grid item xs={12}>
                    <RoleSelector
                        choices={selectedRoles}
                        handleSelect={handleRoleSelect}
                    />
                </Grid>
                <Grid container item justify={"space-evenly"}>
                    <Grid item>
                        <TextField
                            value={preNightWaitTime}
                            onChange={handlePreNightWaitTimeChange}
                            inputProps={{
                                step: 1,
                                min: 3,
                                max: 60,
                                type: 'number',
                                className: classes.input,
                            }}
                            InputProps={{
                                endAdornment: <InputAdornment
                                    position="end">s</InputAdornment>
                            }}
                            label="Time before night"
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                            value={roleWaitTime}
                            onChange={handleRoleWaitTimeChange}
                            inputProps={{
                                step: 1,
                                min: 2,
                                max: 60,
                                type: 'number',
                                className: classes.input,
                            }}
                            InputProps={{
                                endAdornment: <InputAdornment
                                    position="end">s</InputAdornment>
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
                                className: classes.input,
                            }}
                            InputProps={{
                                endAdornment: <InputAdornment
                                    position="end">m</InputAdornment>
                            }}
                            label="Time for vote"
                            variant="outlined"
                        />
                    </Grid>
                </Grid>
            </Grid>
        </Dialog>
    )
}

SettingsDialog.propTypes = {
    open: PropTypes.bool,
    handleClose: PropTypes.func.isRequired,
    configurableRoles: PropTypes.arrayOf(PropTypes.string),
}

SettingsDialog.defaultProps = {
    open: false,
}
