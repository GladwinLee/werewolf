import React from 'react';
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import capitalize from "@material-ui/core/utils/capitalize";
import PropTypes from 'prop-types';
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

export default function CheckboxList(props) {
    const [choices, setChoices] = React.useState(props.choices)
    const handleChange = (event) => {
        setChoices({...props.choices, [event.target.name]: event.target.checked});
    };

    const handleSubmit = () => {
        props.onSubmit(choices);
    }

    const checkboxes = Object.entries(choices).map(([choice, checked]) => {
        return (
            <FormControlLabel
                key={choice}
                control={<Checkbox checked={checked} onChange={handleChange} name={choice}/>}
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
            <Grid item xs={12}>
                <Button variant="contained" onClick={handleSubmit}>{props.buttonValue}</Button>
            </Grid>
        </Grid>
    )
}

CheckboxList.propTypes = {
    choices: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
    buttonValue: PropTypes.string,
}