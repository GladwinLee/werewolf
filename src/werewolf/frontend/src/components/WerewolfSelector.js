import React from "react";
import Grid from "@material-ui/core/Grid";
import PropTypes from "prop-types";
import IconButton from "@material-ui/core/IconButton";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import Typography from "@material-ui/core/Typography";

export default function WerewolfSelector({numWerewolves, handleChange}) {
    const onAdd = () => {
        handleChange(numWerewolves + 1)
    }
    const onRemove = () => {
        if (numWerewolves === 1) {
            return;
        }
        handleChange(numWerewolves - 1);
    }

    return (
        <>
            <Grid container justify="center">
                <Grid item>
                    <IconButton
                        aria-label="expand row"
                        size="medium"
                        onClick={onRemove}
                    >
                        <RemoveCircleIcon/>
                    </IconButton>
                </Grid>
                <Grid item>
                    <Typography variant="h4">
                        Werewolves x{numWerewolves}
                    </Typography>
                </Grid>
                <Grid item>
                    <IconButton
                        aria-label="expand row"
                        size="medium"
                        onClick={onAdd}
                    >
                        <AddCircleIcon/>
                    </IconButton>
                </Grid>
            </Grid>
        </>
    )
}

WerewolfSelector.propTypes = {
    numWerewolves: PropTypes.number.isRequired,
    handleChange: PropTypes.func.isRequired,
}

WerewolfSelector.defaultProps = {}