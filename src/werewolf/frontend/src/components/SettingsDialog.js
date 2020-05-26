import React, {useEffect, useState} from "react";
import Grid from "@material-ui/core/Grid";
import RoleSelector from "./RoleSelector";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from "@material-ui/core/TextField";
import {useCookies} from "react-cookie";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import PropTypes from "prop-types";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import {makeStyles} from "@material-ui/core/styles";
import WerewolfSelector from "./WerewolfSelector";
import Container from "@material-ui/core/Container";

const useStyles = makeStyles({
    dialogTitle: {
        justifyContent: "flex-end",
        width: "100%",
    }
})

export default function SettingsDialog(props) {
    const classes = useStyles();
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
    const [roleWaitTime, setRoleWaitTime] = React.useState(
        (cookies.roleWaitTime == null) ? 7 : Number(cookies.roleWaitTime)
    );
    const [voteWaitTime, setVoteWaitTime] = React.useState(
        (cookies.voteWaitTime == null) ? 5 : Number(cookies.voteWaitTime)
    );
    const [numWerewolves, setNumWerewolves] = React.useState(
        (cookies.numWerewolves == null) ? 2 : Number(cookies.numWerewolves)
    );

    const settings = {
        "selected_roles": selectedRoles,
        "role_wait_time": roleWaitTime,
        "vote_wait_time": voteWaitTime,
        "num_werewolves": numWerewolves,
    };

    if (settings.role_wait_time == null) {
        settings.role_wait_time = 7
    }
    if (settings.vote_wait_time == null) {
        settings.vote_wait_time = 5
    }
    if (settings.num_werewolves == null) {
        settings.num_werewolves = 2
    }

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
        <Dialog open={props.open} onClose={handleClose}>
            <DialogTitle className={classes.dialogTitle}>
                <IconButton onClick={handleClose}>
                    <CloseIcon/>
                </IconButton>
            </DialogTitle>
            <Container>
                <WerewolfSelector
                    numWerewolves={numWerewolves}
                    handleChange={handleNumWerewolvesChange}
                />
                <RoleSelector
                    choices={selectedRoles}
                    handleSelect={handleRoleSelect}
                />
                <Grid container justify="space-evenly">
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
                </Grid>
            </Container>
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