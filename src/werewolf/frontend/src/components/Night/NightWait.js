import React from 'react';
import PropTypes from 'prop-types';
import Typography from "@material-ui/core/Typography";
import capitalize from "@material-ui/core/utils/capitalize";
import Timer from "../Timer";
import Grid from "@material-ui/core/Grid";
import {makeStyles} from "@material-ui/core/styles";
import RoleTooltip from "../RoleTooltip";

const useStyles = makeStyles({
    typography: {
        fontSize: "1.5em"
    },
    timerGrid: {
        height: "5vh",
    }
})

export default function NightWait({currentRole, roleCount, waitTime, playerRole}) {
    const classes = useStyles();
    return (
        <>
            <Grid item xs={12}>
                {Object.entries(roleCount).map(([role, count]) => {
                    let color = "textSecondary";
                    if (role === currentRole) color = "textPrimary";
                    if (role === playerRole) color = "primary";
                    return (
                        <RoleTooltip
                            role={role}
                            key={"night-wait-" + role}
                        >
                            <Typography
                                color={color}
                                className={classes.typography}
                            >
                                {`${capitalize(role)}${(count && `x${count}`)}`}
                            </Typography>
                        </RoleTooltip>
                    )
                })}
            </Grid>
            <Grid item xs={12} className={classes.timerGrid}><Timer
                start={waitTime}
                preText={`Waiting for ${capitalize(currentRole)}: `}
                timerKey={currentRole}
            /></Grid>
        </>
    )
}

NightWait.propTypes = {
    currentRole: PropTypes.string.isRequired,
    roleCount: PropTypes.object.isRequired,
    playerRole: PropTypes.string.isRequired,
    waitTime: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
}

NightWait.defaultProps = {}