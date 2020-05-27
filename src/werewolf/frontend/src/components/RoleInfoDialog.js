import React from "react";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import PropTypes from "prop-types";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import {makeStyles} from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import capitalize from "@material-ui/core/utils/capitalize";

const useStyles = makeStyles({
    dialogTitle: {
        justifyContent: "flex-end",
        width: "100%",
    }
})

export default function RoleInfoDialog({roles, open, handleClose}) {
    const classes = useStyles();

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle className={classes.dialogTitle}>
                <IconButton onClick={handleClose}>
                    <CloseIcon/>
                </IconButton>
            </DialogTitle>
            <Container>
                {roles.map((role) => (
                    <div key={"role-info-" + role}>
                        <Typography>
                            {capitalize(role)}
                        </Typography>
                    </div>
                ))}
            </Container>
        </Dialog>
    )
}

RoleInfoDialog.propTypes = {
    open: PropTypes.bool,
    handleClose: PropTypes.func.isRequired,
    roles: PropTypes.object,
}

RoleInfoDialog.defaultProps = {
    open: false,
}