import React from "react";
import CheckboxList from "./CheckboxList";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";

export default function GameSetupMaster(props) {
    const [selectedRoles, setSelectedRoles] = React.useState({
        seer: true,
        robber: false,
        troublemaker: false,
    });

    const handleRoleSelect = (selectedRoles) => {
        setSelectedRoles(selectedRoles);
    }

    const handleStart = () => {
        props.onStart(selectedRoles);
    }

    return (
        <Grid container>
            <Grid item xs={12}>
                <CheckboxList choices={selectedRoles} handleChange={handleRoleSelect}/>
            </Grid>
            <Grid item xs={12}>
                <Button variant="contained" onClick={handleStart}>Start</Button>
            </Grid>
        </Grid>
    )
}