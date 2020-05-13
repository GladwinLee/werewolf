import React from 'react';
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Typography from "@material-ui/core/Typography";

function ActionChoice (props) {
    const choices = props.choices.map((p) => {
        return (
            <Button
                onClick={() => props.onChoice(p)}
            >
                {p}
            </Button>
        )
    });
    return (
        <div>
            <Typography variant="h4">{props.children}</Typography>
            <ButtonGroup
                orientation="vertical"
                color="primary"
            >
                {choices}
            </ButtonGroup>
        </div>
    );
}

export default ActionChoice;