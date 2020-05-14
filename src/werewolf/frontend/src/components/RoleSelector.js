import React from 'react';
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

export default function RoleSelector(props) {
    const [state, setState] = React.useState({
        seer: true,
        robber: false,
        troublemaker: false,
    });

    const handleChange = (event) => {
        setState({...state, [event.target.name]: event.target.checked});
        props.handleRoleSelect(state);
    };

    props.handleRoleSelect(state);
    return (
        <FormControl component="fieldset">
            <FormLabel component="legend">Roles</FormLabel>
            <FormGroup>
                <FormControlLabel
                    control={<Checkbox checked={state.seer} onChange={handleChange} name="seer"/>}
                    label="Seer"
                />
                <FormControlLabel
                    control={<Checkbox checked={state.robber} onChange={handleChange} name="robber"/>}
                    label="Robber"
                />
                <FormControlLabel
                    control={<Checkbox checked={state.troublemaker} onChange={handleChange} name="troublemaker"/>}
                    label="Troublemaker"
                />
            </FormGroup>
        </FormControl>
    )
}
