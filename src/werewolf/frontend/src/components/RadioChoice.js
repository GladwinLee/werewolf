import React, {useState} from 'react';
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import PropTypes from 'prop-types';

export default function RadioChoice(props) {
    const [value, setValue] = useState(props.default);

    const GetLabel = ({p}) => {
        const specialLabel = props.specialChoiceLabels[p];
        return (specialLabel) ? specialLabel : p;
    }

    const choices = props.choices.map((p) => (
        <FormControlLabel
            value={p}
            label={<GetLabel p={p}/>}
            key={p}
            control={<Radio/>}
            disabled={(props.disabledChoices[p] || props.disableAll)}
        />
    ));

    const handleChange = (e) => {
        setValue(e.target.value);
        props.onChange(e.target.value);
    }
    const handleSubmit = () => props.onSubmit(value);

    return (
        <div>
            <Typography variant="h4">{props.label}</Typography>
            <RadioGroup
                orientation="vertical"
                color="primary"
                onChange={handleChange}
                value={value}
            >
                {choices}
            </RadioGroup>
            <Button variant="contained" onClick={handleSubmit}
                    disabled={props.disableAll}>
                Submit
            </Button>
        </div>
    );
}

RadioChoice.propTypes = {
    choices: PropTypes.arrayOf(PropTypes.string).isRequired,
    onSubmit: PropTypes.func.isRequired,
    onChange: PropTypes.func,
    default: PropTypes.string,
    label: PropTypes.node,
    disabledChoices: PropTypes.object,
    disableAll: PropTypes.bool,
    specialChoiceLabels: PropTypes.object,
}

RadioChoice.defaultProps = {
    default: "",
    onChange: () => {
    },
    disabledChoices: {},
    disableAll: false,
    specialChoiceLabels: {},
}