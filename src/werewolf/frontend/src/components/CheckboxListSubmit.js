import React, {useEffect} from 'react';
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import capitalize from "@material-ui/core/utils/capitalize";
import PropTypes from 'prop-types';
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import FormHelperText from "@material-ui/core/FormHelperText";

export default function CheckboxListSubmit(props) {
    const [choices, setChoices] = React.useState(props.choices);

    const choicesRef = React.useRef()

    const numSelected = Object.values(choices).filter((v) => v).length;
    const error = numSelected < props.minChoice || numSelected
        > props.maxChoice;
    const errorMessage = (props.minChoice !== props.maxChoice) ?
        `Must choose between ${props.minChoice} and ${props.maxChoice}` :
        `Must choose ${props.minChoice}`;

    const handleChange = (event) => {
        const newChoices = {
            ...choices,
            [event.target.name]: event.target.checked
        };
        setChoices(newChoices);
        choicesRef.current = newChoices;
    };

    const handleSubmit = () => {
        console.log("submit");
        console.log(choicesRef.current);
        if (!choicesRef.current) {
            choicesRef.current = choices;
        }

        const numSelected = Object.values(choicesRef.current).filter(
            (v) => v).length;
        const error = numSelected < props.minChoice || numSelected
            > props.maxChoice;
        if (!error) {
            props.onSubmit(choicesRef.current);
        }
    }

    if (props.autoSubmitAfter) {
        useEffect(() => {
            let timeout = setTimeout(handleSubmit,
                props.autoSubmitAfter * 1000);
            return () => {
                clearTimeout(timeout)
            };
        }, [])
    }

    const checkboxes = Object.entries(choices).map(([choice, checked]) => {
        return (
            <FormControlLabel
                key={choice}
                control={<Checkbox checked={checked} onChange={handleChange}
                                   name={choice}/>}
                label={capitalize(choice)}
            />
        )
    })

    return (
        <Grid container>
            <Grid item xs={12}>
                <FormControl component="fieldset" error={error}>
                    <FormLabel component="legend">Roles</FormLabel>
                    <FormGroup>
                        {checkboxes}
                    </FormGroup>
                    <FormHelperText>
                        {error ? errorMessage : null}
                    </FormHelperText>
                </FormControl>
            </Grid>
            <Grid item xs={12}>
                <Button variant="contained"
                        onClick={handleSubmit}>{props.buttonValue}</Button>
            </Grid>
        </Grid>
    )
}

CheckboxListSubmit.propTypes = {
    choices: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
    buttonValue: PropTypes.string,
    minChoice: PropTypes.number,
    maxChoice: PropTypes.number,
    autoSubmitAfter: PropTypes.number,
}

CheckboxListSubmit.defaultProps = {
    buttonValue: "Submit",
    minChoice: 0,
    maxChoice: Number.MAX_SAFE_INTEGER,
}