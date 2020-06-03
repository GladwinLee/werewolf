import React from "react";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {roleInfo, teamColor} from "./roleConstants";
import capitalize from "@material-ui/core/utils/capitalize";

const useStyles = makeStyles((theme) => ({
    icon: {
        marginRight: theme.spacing(2),
    }
}));

export default function RoleHelp({role}) {
    const {team, help} = roleInfo[role];
    return (
        <>
            <Typography style={{color: teamColor[team]}}>
                {`${capitalize(team)} team`}
            </Typography>
            <Typography
                variant={"subtitle2"}
                style={{whiteSpace: "pre-line"}}
            >
                {help}
            </Typography>
        </>
    )
}

RoleHelp.propTypes = {
    role: PropTypes.string.isRequired,
}
