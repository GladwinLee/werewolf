import React from 'react';
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Typography from "@material-ui/core/Typography";

function Choice(props) {
    const choices = props.choices.map((p) => {
        return (
            <Button
                key={p}
                onClick={() => props.onChoice(p)}
            >
                {p}
            </Button>
        )
    });
    return (
        <div>
            <Typography variant="h4">{props.label}</Typography>
            <ButtonGroup
                fullWidth
                orientation="vertical"
                color="primary"
            >
                {choices}
            </ButtonGroup>
        </div>
    );
}

export default Choice;