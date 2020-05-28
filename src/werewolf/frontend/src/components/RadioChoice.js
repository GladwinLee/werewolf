import React, {useState} from 'react';
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Radio from "@material-ui/core/Radio";
import PropTypes from 'prop-types';
import makeStyles from "@material-ui/core/styles/makeStyles";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles({
    buttonGroup: {
        borderRadius: "borderRadius"
    }
})

export default function RadioChoice(props) {
    const classes = useStyles();
    const [value, setValue] = useState(props.default);

    const GetLabel = ({p}) => {
        const specialLabel = props.specialChoiceLabels[p];
        return (specialLabel) ? specialLabel : p;
    }

    const choices = props.choices.map((p) => (
        <Button
            variant={(value === p) ? "contained" : "outlined"}
            key={p}
            control={<Radio/>}
            disabled={(props.disabledChoices[p] || props.disableAll)}
            onClick={() => handleChange(p)}
        >
            <GetLabel p={p}/>
        </Button>
    ));

    const handleChange = (p) => {
        setValue(p);
        props.onChange(p);
    }
    const handleSubmit = () => props.onSubmit(value);

    return (
        <Grid container item justify="center" spacing={3}>
            <Grid item xs={12}>
                <Typography variant="h4">{props.label}</Typography>
            </Grid>
            <Grid item xs={12}>
                <ButtonGroup
                    className={classes.buttonGroup}
                    orientation="vertical"
                    color="primary"
                    size="large"
                    fullWidth
                >
                    {choices}
                </ButtonGroup>
            </Grid>
            {props.onSubmit &&
            <Grid container item xs={12} justify="center">
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={props.disableAll}
                >
                    Submit
                </Button>
            </Grid>}
        </Grid>
    );
}

RadioChoice.propTypes = {
    choices: PropTypes.arrayOf(PropTypes.string).isRequired,
    onSubmit: PropTypes.func,
    onChange: PropTypes.func,
    default: PropTypes.string,
    label: PropTypes.node,
    disabledChoices: PropTypes.object,
    disableAll: PropTypes.bool,
    specialChoiceLabels: PropTypes.object,
}

RadioChoice.defaultProps = {
    default: "",
    onChange: () => {},
    disabledChoices: {},
    disableAll: false,
    specialChoiceLabels: {},
}