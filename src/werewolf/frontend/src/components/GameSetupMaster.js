import React from "react";
import RoleSelector from "./RoleSelector";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";

export default function GameSetupMaster(props) {
    const [selectedRoles, setSelectedRoles] = React.useState({});

    const handleRoleSelect = (selectedRoles) => {
        setSelectedRoles(selectedRoles);
    }

    const handleStart = () => {
        props.onStart(selectedRoles);
    }

    return (
        <Grid container>
            <Grid item>
                <RoleSelector handleRoleSelect={handleRoleSelect}/>
            </Grid>
            <Grid item>
                <Button variant="contained" onClick={handleStart}>Start</Button>
            </Grid>
        </Grid>
    )
}