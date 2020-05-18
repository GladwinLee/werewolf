import React from "react";
import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import capitalize from "@material-ui/core/utils/capitalize";
import PropTypes from "prop-types";

export default function CheckboxList(props) {
    const handleRoleSelect = (event) => {
        props.handleSelect(
            {...props.choices, [event.target.name]: event.target.checked});
    };

    const checkboxes = Object.entries(props.choices).map(
        ([choice, checked]) => {
            return (
                <FormControlLabel
                    key={choice}
                    control={<Checkbox checked={checked}
                                       onChange={handleRoleSelect}
                                       name={choice}/>}
                    label={capitalize(choice)}
                />
            )
        })

    return (
        <Grid container>
            <Grid item xs={12}>
                <FormControl component="fieldset">
                    <FormLabel component="legend">Roles</FormLabel>
                    <FormGroup>
                        {checkboxes}
                    </FormGroup>
                </FormControl>
            </Grid>
        </Grid>
    )
}

CheckboxList.propTypes = {
    choices: PropTypes.object.isRequired,
    handleSelect: PropTypes.func.isRequired,
}