import React from "react";
import CheckboxList from "./CheckboxList";

const selectedRoles = {
    seer: true,
    robber: true,
    troublemaker: false,
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