import React from "react";
import capitalize from "@material-ui/core/utils/capitalize";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import {makeStyles} from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles({
    grid: {
        height: "100%",
        width: "100%",
    },
    root: {
        borderRadius: 0,
    },
    label: {
        fontSize: "1.2rem",
    }
})

export default function RoleSelector(props) {
    const classes = useStyles();
    const handleRoleSelect = (choice) => {
        props.handleSelect(
            {...props.choices, [choice]: !props.choices[choice]});
    };

    const choices = Object.entries(props.choices).map(
        ([choice, checked]) => {
            return (
                <Grid item xs={6}
                      key={"role-GridList-" + choice}
                      className={classes.grid}
                >
                    <Button
                        classes={{
                            root: classes.root,
                            label: classes.label,
                        }}
                        color="primary"
                        variant={(checked) ? "contained" : "outlined"}
                        onClick={() => handleRoleSelect(choice)}
                        size="small"
                        fullWidth
                    >
                        {capitalize(choice)}
                    </Button>
                </Grid>
            )
        })

    return (
        <>
            <Grid container>
                {choices}
            </Grid>
        </>
    )
}

RoleSelector.propTypes = {
    choices: PropTypes.object.isRequired,
    handleSelect: PropTypes.func.isRequired,
}