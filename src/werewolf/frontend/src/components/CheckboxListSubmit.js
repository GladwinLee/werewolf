import React, {useState} from 'react';
import capitalize from "@material-ui/core/utils/capitalize";
import PropTypes from 'prop-types';
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import FormHelperText from "@material-ui/core/FormHelperText";
import ButtonGroup from "@material-ui/core/ButtonGroup";

export default function CheckboxListSubmit(props) {
    const [choices, setChoices] = useState(props.choices);
    const [chosenQueue, setChosenQueue] = useState([]);

    const numSelected = Object.values(choices).filter((v) => v).length;
    const error = numSelected < props.minChoice
        || numSelected > props.maxChoice;

    const errorMessage = (props.minChoice !== props.maxChoice) ?
        `Must choose between ${props.minChoice} and ${props.maxChoice}` :
        `Must choose ${props.minChoice}`;

    const handleChange = (name) => {
        let newValues = {};
        newValues[name] = !choices[name]

        if (props.noAboveMax) {
            console.log(chosenQueue)
            if (chosenQueue.includes(name)) {
                setChosenQueue(chosenQueue.filter(n => n !== name))
            } else if (chosenQueue.length === props.maxChoice) {
                let oldestValue = chosenQueue.shift();
                newValues[oldestValue] = false;
                setChosenQueue(chosenQueue.concat([name]))
            } else {
                setChosenQueue(chosenQueue.concat([name]))
            }
        }

        const newChoices = {...choices, ...newValues,};
        setChoices(newChoices);
        props.onChange(newChoices);
    };

    const handleSubmit = () => {
        const numSelected = Object.values(choices).filter((v) => v).length;
        const error = numSelected < props.minChoice
            || numSelected > props.maxChoice;
        if (!error) props.onSubmit(choices);
    }

    const checkboxes = Object.entries(choices).map(([choice, checked]) => (
        <Button
            variant={(checked) ? "contained" : "outlined"}
            key={choice}
            disabled={(props.disabledChoices[choice])}
            onClick={() => handleChange(choice)}
        >
            {capitalize(choice)}
        </Button>
    ));

    return (
        <Grid container item justify="center">
            <Grid item xs={12}>
                <ButtonGroup
                    orientation="vertical"
                    color="primary"
                    size="large"
                    fullWidth
                >
                    {checkboxes}
                </ButtonGroup>
                <FormHelperText error={error}>{error ? errorMessage
                    : " "}</FormHelperText>
            </Grid>
            {props.onSubmit &&
            <Grid item xs={12}>
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                >
                    {props.buttonValue}
                </Button>
            </Grid>}
        </Grid>
    )
}

CheckboxListSubmit.propTypes = {
    choices: PropTypes.object.isRequired,
    onChange: PropTypes.func,
    buttonValue: PropTypes.string,
    minChoice: PropTypes.number,
    maxChoice: PropTypes.number,
    disabledChoices: PropTypes.object,
    onSubmit: PropTypes.func,
    noAboveMax: PropTypes.bool,
}

CheckboxListSubmit.defaultProps = {
    buttonValue: "Submit",
    minChoice: 0,
    maxChoice: Number.MAX_SAFE_INTEGER,
    onChange: () => {
    },
    disabledChoices: {},
    noAboveMax: false,
}