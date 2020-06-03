import React, {useState} from "react";
import Dialog from "@material-ui/core/Dialog";
import PropTypes from "prop-types";
import {makeStyles} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import capitalize from "@material-ui/core/utils/capitalize";
import Grid from "@material-ui/core/Grid";
import RoleTooltip from "../RoleTooltip";

const useStyles = makeStyles((theme) => ({
    dialog: {
        height: "100%",
    },
    paper: {
        overflow: "hidden",
    },
    dialogGrid: {
        height: "100%",
        padding: theme.spacing(3),
    },
    input: {
        fontSize: "1.3rem"
    },
}))

export default function RoleInfoDialog({roleCount: propRoleCount, open, handleClose}) {
    const classes = useStyles();
    const [roleCount, setRoleCount] = useState(propRoleCount);

    return (
        <Dialog open={open} onClose={handleClose}
                classes={{paper: classes.paper}}>
            <Grid container spacing={3} className={classes.dialogGrid}>
                {Object.entries(roleCount).map(([role, count]) => (
                    <Grid item xs={12} key={"role-info-" + role}>
                        <RoleTooltip role={role}>
                            <Typography>
                                {`${capitalize(role)} ${(count) ? `x${count}`
                                    : ""}`}
                            </Typography>
                        </RoleTooltip>
                    </Grid>
                ))}
            </Grid>
        </Dialog>
    )
}

RoleInfoDialog.propTypes = {
    open: PropTypes.bool,
    handleClose: PropTypes.func.isRequired,
    roleCount: PropTypes.object,
}

RoleInfoDialog.defaultProps = {
    open: false,
}