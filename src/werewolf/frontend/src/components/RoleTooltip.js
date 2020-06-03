import React from "react";
import PropTypes from "prop-types";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Tooltip from "@material-ui/core/Tooltip";
import RoleHelp from "./RoleHelp";

const useStyles = makeStyles((theme) => ({
    icon: {
        marginRight: theme.spacing(2),
    }
}))

export default function RoleTooltip({role, children, ...props}) {
    const classes = useStyles(props);
    return (
        <Tooltip
            title={<RoleHelp role={role}/>}
            enterTouchDelay={150}
            placement="top"
        >
            {children}
        </Tooltip>
    )
};

RoleTooltip.propTypes = {
    role: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
}