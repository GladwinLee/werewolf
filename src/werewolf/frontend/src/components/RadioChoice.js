import React, {useState} from 'react';
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Radio from "@material-ui/core/Radio";
import PropTypes from 'prop-types';
import makeStyles from "@material-ui/core/styles/makeStyles";
import ButtonGroup from "@material-ui/core/ButtonGroup";

const useStyle = makeStyles({
    buttonGroup: {
        borderRadius: "borderRadius"
    }
})

export default function RadioChoice(props) {
    const classes = useStyle();
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
        <div>
            <Typography variant="h4">{props.label}</Typography>
            <ButtonGroup
                className={classes.buttonGroup}
                orientation="vertical"
                color="primary"
                size="large"
            >
                {choices}
            </ButtonGroup>
            {props.onSubmit && <Button variant="contained"
                                       onClick={handleSubmit}
                                       disabled={props.disableAll}>
                Submit
            </Button>}
        </div>
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