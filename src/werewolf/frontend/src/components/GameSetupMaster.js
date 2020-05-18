import React, {useState} from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import CheckboxList from "./CheckboxList";
import Input from "@material-ui/core/Input";
import Typography from "@material-ui/core/Typography";

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
    const handleWaitTimeChange = (event) => {
        setRoleWaitTime(
            event.target.value === '' ? '' : Number(event.target.value));
    };

    const handleSubmit = () => {
        const settings = {
            "selected_roles": selectedRoles,
            "role_wait_time": roleWaitTime,
        }
        props.handleStart(settings);
    }

    return (
        <Grid container>
            <Grid item xs={12}>
                <CheckboxList
                    choices={selectedRoles}
                    handleSelect={handleRoleSelect}
                />
            </Grid>
            <Grid container item xs={12} spacing={1}>
                <Grid item>
                    <Typography>Seconds per role</Typography>
                </Grid>
                <Grid item>
                    <Input
                        value={roleWaitTime}
                        margin="dense"
                        onChange={handleWaitTimeChange}
                        inputProps={{
                            step: 1,
                            min: 3,
                            max: 100,
                            type: 'number',
                            'aria-labelledby': 'input-slider',
                        }}
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