import React from "react";
import CheckboxList from "./CheckboxList";

export default function GameSetupMaster(props) {
    const configurableRoles = {};
    if (props.configurableRoles) {
        props.configurableRoles.forEach(
            (role) => {
                configurableRoles[role] = false;
            }
        );
    }

    return (
        <CheckboxList
            choices={configurableRoles}
            onSubmit={props.handleStart}
            buttonValue={"Start"}
        />
    )
}