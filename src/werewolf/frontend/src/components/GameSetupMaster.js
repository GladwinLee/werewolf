import React from "react";
import CheckboxList from "./CheckboxList";

const selectedRoles = {
    seer: false,
    robber: false,
    troublemaker: true,
}

export default function GameSetupMaster(props) {
    return (
        <CheckboxList
            choices={selectedRoles}
            onSubmit={props.handleStart}
            buttonValue={"Start"}
        />
    )
}