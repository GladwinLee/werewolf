import React from 'react';
import PropTypes from 'prop-types';
import Typography from "@material-ui/core/Typography";
import capitalize from "@material-ui/core/utils/capitalize";
import Timer from "./Timer";
import PageGrid from "./PageGrid";
import Grid from "@material-ui/core/Grid";
import {makeStyles} from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import {roleInfo} from "./roleConstants";
import NightAnimatedIcon from "./NightAnimatedIcon";

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
        <PageGrid>
            <Grid item xs={12}>
                <Typography variant="h3" gutterBottom>
                    Night time
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <NightAnimatedIcon time={10}/>
            </Grid>
            <Grid item xs={12}>
                {Object.entries(roleCount).map(([role, count]) => {
                    let color = "textSecondary";
                    if (role === currentRole) color = "textPrimary";
                    if (role === playerRole) color = "primary";
                    return (
                        <Tooltip
                            title={roleInfo[role]} enterTouchDelay={150}
                            arrow
                            placement="top"
                            key={"night-wait-" + role}
                        >
                            <Typography
                                color={color}
                                className={classes.typography}
                            >
                                {`${capitalize(role)}${(count && `x${count}`)}`}
                            </Typography>
                        </Tooltip>
                    )
                })}
            </Grid>
            <Grid item xs={12} className={classes.timerGrid}><Timer
                start={waitTime}
                preText={`Waiting for ${capitalize(currentRole)}: `}
                timerKey={currentRole}
            /></Grid>
        </PageGrid>
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