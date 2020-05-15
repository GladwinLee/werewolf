import React from 'react';
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import capitalize from "@material-ui/core/utils/capitalize";

export default function CheckboxList(props) {
    const handleChange = (event) => {
        props.handleChange({...props.choices, [event.target.name]: event.target.checked});
    };

    const checkboxes = Object.entries(props.choices).map(([choice, checked]) => {
        return (
            <FormControlLabel
                key={choice}
                control={<Checkbox checked={checked} onChange={handleChange} name={choice}/>}
                label={capitalize(choice)}
            />
        )
    })

    return (
        <FormControl component="fieldset">
            <FormLabel component="legend">Roles</FormLabel>
            <FormGroup>
                {checkboxes}
            </FormGroup>
        </FormControl>
    )
}
