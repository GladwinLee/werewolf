import React from "react";
import Typography from "@material-ui/core/Typography";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import Grid from "@material-ui/core/Grid";
import PropTypes from 'prop-types';

export default function Collapsible(props) {
    const [open, setOpen] = React.useState(props.open);

    return (
        <div>
            <Grid container direction="row" alignItems="center">
                <Grid item>
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                    </IconButton>
                </Grid>
                <Grid item>
                    <Typography>{props.value}</Typography>
                </Grid>
            </Grid>
            <Collapse in={open}>
                {props.children}
            </Collapse>
        </div>
    )
}

Collapsible.propTypes = {
    value: PropTypes.object,
    open: PropTypes.bool,
}

Collapsible.defaultProps = {
    open: true,
}