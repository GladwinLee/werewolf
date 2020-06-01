import React from "react";
import Dialog from "@material-ui/core/Dialog";
import PropTypes from "prop-types";
import {makeStyles} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

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

export default function InfoMessagesDialog({infoMessages, open, handleClose}) {
    const classes = useStyles();
    return (
        <Dialog open={open} onClose={handleClose}
                classes={{paper: classes.paper}}>
            {(infoMessages.length > 1) ?
                infoMessages.map(message => (
                    <Typography>{message}</Typography>
                ))
                : <Typography>No info messages</Typography>}
        </Dialog>
    )
}

InfoMessagesDialog.propTypes = {
    open: PropTypes.bool,
    handleClose: PropTypes.func.isRequired,
    infoMessages: PropTypes.arrayOf(PropTypes.string),
}

InfoMessagesDialog.defaultProps = {
    open: false,
}