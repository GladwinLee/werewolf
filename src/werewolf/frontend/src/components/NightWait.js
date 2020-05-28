import React from 'react';
import PropTypes from 'prop-types';
import Typography from "@material-ui/core/Typography";
import capitalize from "@material-ui/core/utils/capitalize";
import Timer from "./Timer";
import PageGrid from "./PageGrid";
import Grid from "@material-ui/core/Grid";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles({
    typography: {
        fontSize: "1.5em"
    }
})

export default function NightWait({currentRole, roles, waitTime, playerRole}) {
    const classes = useStyles();
    return (
        <PageGrid>
            <Grid item xs={12}>
                <Typography variant="h3" gutterBottom>
                    Night time
                </Typography>
            </Grid>
            <Grid item xs={12}>
                {roles.map((role) => {
                    let color = "textSecondary";
                    if (role === currentRole) color = "textPrimary";
                    if (role === playerRole) color = "primary";
                    return (
                        <Typography
                            key={"night-wait-" + role}
                            color={color}
                            className={classes.typography}
                        >
                            {capitalize(role)}
                        </Typography>
                    )
                })}
            </Grid>
            <Grid item xs={12}><Timer
                start={waitTime}
                preText={`Waiting for ${capitalize(currentRole)}: `}
                timerKey={currentRole}
            /></Grid>
        </PageGrid>
    )
}

NightWait.propTypes = {
    currentRole: PropTypes.string.isRequired,
    roles: PropTypes.arrayOf(PropTypes.string).isRequired,
    playerRole: PropTypes.string.isRequired,
    waitTime: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
}

NightWait.defaultProps = {}