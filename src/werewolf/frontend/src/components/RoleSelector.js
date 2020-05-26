import React from "react";
import capitalize from "@material-ui/core/utils/capitalize";
import PropTypes from "prop-types";
import GridListTile from "@material-ui/core/GridListTile";
import Button from "@material-ui/core/Button";
import GridList from "@material-ui/core/GridList";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles({
    gridListItem: {
        height: "100%",
        width: "100%",
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
                <GridListTile key={"role-GridList-" + choice} cols={1}
                              className={classes.gridListItem}>
                    <Button
                        color="primary"
                        variant={(checked) ? "contained" : "outlined"}
                        onClick={() => handleRoleSelect(choice)}
                    >
                        {capitalize(choice)}
                    </Button>
                </GridListTile>
            )
        })

    return (
        <GridList cellHeight={40} cols={4}>
            {choices}
        </GridList>
    )
}

RoleSelector.propTypes = {
    choices: PropTypes.object.isRequired,
    handleSelect: PropTypes.func.isRequired,
}