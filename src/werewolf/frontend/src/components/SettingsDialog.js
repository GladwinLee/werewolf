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
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
}))

export default function SettingsDialog(props) {
    const classes = useStyles(props);
    const [cookies, setCookies] = useCookies(
        ["selectedRoles", "roleWaitTime", "voteWaitTime", "numWerewolves"]);

    const initialSelectedRoles = {};
    if (props.configurableRoles) {
        props.configurableRoles.forEach(
            (role) => initialSelectedRoles[role] = cookies.selectedRoles
                && !!cookies.selectedRoles[role]
        );
    }

    const [selectedRoles, setSelectedRoles] = useState(initialSelectedRoles);
    const [roleWaitTime, setRoleWaitTime] = useState(
        (cookies.roleWaitTime == null) ? 7 : Number(cookies.roleWaitTime)
    );
    const [voteWaitTime, setVoteWaitTime] = useState(
        (cookies.voteWaitTime == null) ? 5 : Number(cookies.voteWaitTime)
    );
    const [numWerewolves, setNumWerewolves] = useState(
        (cookies.numWerewolves == null) ? 2 : Number(cookies.numWerewolves)
    );

    const settings = {
        "selected_roles": selectedRoles,
        "role_wait_time": roleWaitTime,
        "vote_wait_time": voteWaitTime,
        "num_werewolves": numWerewolves,
    };

    if (settings.role_wait_time == null) settings.role_wait_time = 7;
    if (settings.vote_wait_time == null) settings.vote_wait_time = 5;
    if (settings.num_werewolves == null) settings.num_werewolves = 2;

    // Send initial settings on first render
    useEffect(() => props.handleClose(settings), [])

    const handleRoleSelect = (choices) => setSelectedRoles(choices);
    const handleRoleWaitTimeChange = (event) => setRoleWaitTime(
        event.target.value);
    const handleVoteWaitTimeChange = (event) => setVoteWaitTime(
        event.target.value);
    const handleNumWerewolvesChange = setNumWerewolves;

    const handleClose = () => {
        setCookies("selectedRoles", selectedRoles);
        setCookies("roleWaitTime", roleWaitTime);
        setCookies("voteWaitTime", voteWaitTime);
        setCookies("numWerewolves", numWerewolves);
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
                                    position="end">sec</InputAdornment>
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
                                    position="end">min</InputAdornment>
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
